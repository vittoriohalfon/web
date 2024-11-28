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

        // Get user's company ID from the database
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id },
            include: { company: true }
        });

        if (!user?.company?.id) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        const companyId = user.company.id; // Store it in a variable after the check

        const formData = await req.formData();
        const files = formData.getAll('files');

        if (!files.length) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadPromises = files.map(async (file: any) => {
            const buffer = await file.arrayBuffer();
            const fileName = file.name;
            const fileSize = file.size;
            const contentType = file.type;

            const fileExtension = fileName.split('.').pop();
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
            
            const bucketName = process.env.AWS_S3_BUCKET as string;
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
                    companyId: companyId, // Use the stored variable
                    fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
                    fileName: fileName,
                    size: fileSize,
                    contentType: contentType
                },
            });
        });

        const results = await Promise.all(uploadPromises);
        return NextResponse.json({ success: true, files: results });
        
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}