import { NextResponse } from 'next/server';
import { docClient } from '@/lib/dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        pk: userId, // Using clerkUserId as partition key
        sk: 'PROFILE', // Using a sort key for future flexibility
        createdAt: timestamp,
        updatedAt: timestamp,
        // Basic company info
        companyName: data.companySetup.companyName,
        companyWebsite: data.companySetup.companyWebsite,
        annualTurnover: data.companySetup.annualTurnover,
        primaryLocation: data.companySetup.primaryLocation,
        hasTenderExperience: data.companySetup.hasTenderExperience,
        // Detailed company information
        industrySector: data.editableFields.industrySector,
        companyOverview: data.editableFields.companyOverview,
        coreProducts: data.editableFields.coreProducts,
        demographic: data.editableFields.demographic,
        uniqueSellingPoint: data.editableFields.uniqueSellingPoint,
        geographic: data.editableFields.geographic,
      }
    };

    await docClient.send(new PutCommand(params));

    return NextResponse.json({ 
      success: true, 
      message: 'Company profile saved successfully' 
    });
    
  } catch (error) {
    console.error('Error saving company profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 