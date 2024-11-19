import { currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@/lib/prisma';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface FileData {
  name: string;
  content: string;
  size: number;
  type: string;
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { files, companyId } = await req.json();

    const uploadPromises = files.map(async (fileData: FileData) => {
      // Generate a unique file name
      const fileExtension = fileData.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      // Convert base64 to buffer
      const buffer = Buffer.from(fileData.content.split(',')[1], 'base64');

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `past-performance/${uniqueFileName}`,
        Body: buffer,
        ContentType: fileData.type,
      });

      await s3Client.send(command);

      // Create file record in database with proper type conversion
      return prisma.pastPerformance.create({
        data: {
          companyId: parseInt(companyId),
          fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/past-performance/${uniqueFileName}`,
          fileSize: Math.floor(fileData.size),
          contentType: fileData.type
        },
      });
    });

    await Promise.all(uploadPromises);

    return new Response('Files uploaded successfully', { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 