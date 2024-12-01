import { currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';

// Use default credentials chain (will look for ~/.aws/credentials)
const s3Client = new S3Client({
  region: process.env.REGION_AWS || 'eu-central-1'
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
      console.log('No clerk user found');
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    console.log('Received request body:', {
      companyId: body.companyId,
      filesCount: body.files?.length
    });

    if (!body.files || !Array.isArray(body.files)) {
      console.error('No files array in request body');
      return new Response('Bad Request - No files provided', { status: 400 });
    }

    if (!body.companyId) {
      console.error('No companyId provided');
      return new Response('Bad Request - No companyId provided', { status: 400 });
    }

    // Verify AWS credentials are present
    if (!process.env.ACCESS_KEY_ID_AWS || !process.env.SECRET_ACCESS_KEY_AWS || !process.env.REGION_AWS || !process.env.S3_BUCKET_AWS) {
      console.error('Missing AWS credentials or configuration');
      return new Response('Server configuration error', { status: 500 });
    }

    const uploadPromises = body.files.map(async (fileData: FileData) => {
      console.log('Processing file:', {
        name: fileData.name,
        size: fileData.size,
        type: fileData.type
      });

      if (!fileData.content) {
        console.error('File content is missing for:', fileData.name);
        throw new Error(`File content is missing for ${fileData.name}`);
      }

      // Generate a unique file name
      const fileExtension = fileData.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      try {
        // Convert base64 to buffer
        const base64Data = fileData.content.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const bucketName = process.env.S3_BUCKET_AWS as string;
        const key = `past-performance/${uniqueFileName}`;

        console.log('Uploading to S3:', {
          bucket: bucketName,
          key: key,
          contentType: fileData.type
        });

        // Upload to S3
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: fileData.type,
        });

        await s3Client.send(command);
        console.log('Successfully uploaded to S3:', uniqueFileName);

        // Create file record in database
        const fileRecord = await prisma.pastPerformance.create({
          data: {
            companyId: parseInt(body.companyId),
            fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            fileName: fileData.name,
            size: Math.floor(fileData.size),
            contentType: fileData.type
          },
        });
        console.log('Created file record:', fileRecord);

        return fileRecord;
      } catch (error) {
        console.error('Error processing file:', fileData.name, error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);
    console.log('Successfully uploaded all files:', results.length);

    return new Response(JSON.stringify({ success: true, files: results }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 