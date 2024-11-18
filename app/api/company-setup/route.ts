import { NextResponse } from 'next/server';
import { dynamoDb } from '@/lib/dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        id: `company#${data.companySetup.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        // Basic company info
        ...data.companySetup,
        // Detailed company information
        industrySector: data.editableFields.industrySector,
        companyOverview: data.editableFields.companyOverview,
        coreProducts: data.editableFields.coreProducts,
        demographic: data.editableFields.demographic,
        uniqueSellingPoint: data.editableFields.uniqueSellingPoint,
        geographic: data.editableFields.geographic,
      }
    };

    await dynamoDb.send(new PutCommand(params));

    return NextResponse.json({ 
      success: true, 
      message: 'Company data saved successfully' 
    });
    
  } catch (error) {
    console.error('Error saving company setup:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 