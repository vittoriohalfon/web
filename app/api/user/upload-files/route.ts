import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from "@/lib/prisma";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-central-1'
});

export async function POST(req: Request) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get or create user and company
        const user = await prisma.user.upsert({
            where: { clerkId: clerkUser.id },
            update: {},
            create: {
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            },
            include: { company: true }
        });

        if (!user.company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        const company = user.company;

        const formData = await req.formData();
        const files = Array.from(formData.getAll('files'));

        if (!files.length) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            if (!(file instanceof File)) {
                throw new Error('Invalid file type');
            }
            
            const buffer = await file.arrayBuffer();
            const fileName = file.name;
            const fileSize = file.size;
            const contentType = file.type;

            const fileExtension = fileName.split('.').pop();
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
            
            const bucketName = process.env.S3_BUCKET_AWS as string;
            const key = `past-performance/${uniqueFileName}`;

            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: Buffer.from(buffer),
                ContentType: contentType,
            });

            await s3Client.send(command);

            return await prisma.pastPerformance.create({
                data: {
                    companyId: company.id,
                    fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
                    fileName: fileName,
                    size: fileSize,
                    contentType: contentType
                },
            });
        });

        const results = await Promise.all(uploadPromises);
        return NextResponse.json({ 
            success: true, 
            files: results,
            companyId: company.id 
        });
        
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}