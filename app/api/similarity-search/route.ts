import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Configure S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface SearchResult {
  record_id: string;
  metadata?: {
    title_description: string;
    estimated_value: string;
    currency: string;
    // Add other metadata fields as needed
  };
}

// Update the ContractDetails interface to match the actual JSON structure
interface ContractDetails {
  notice_publication_id: string;
  procedure: {
    title: string;
    description: string;
    deadline_date: string;
    deadline_time: string;
  };
  tendering_process: {
    open_tender_date: string;
    open_tender_time: string;
  };
  value: {
    estimated_value: string;
    currency: string;
  };
  buyer: {
    official_name: string;
    email: string;
    website: string;
    address: {
      city: string;
      country: string;
    };
  };
}

async function getContractFromS3(recordId: string): Promise<ContractDetails | null> {
  try {
    const key = `enhanced_final_contracts/${recordId}.json`;
    console.log(`Fetching contract from S3: ${key}`);
    
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'contracts-tracker',
      Key: key,
    });

    try {
      const response = await s3.send(command);
      const contractData = await response.Body?.transformToString();
      
      if (!contractData) {
        console.warn(`Empty response for contract ${recordId}`);
        return null;
      }

      const parsedContract = JSON.parse(contractData);
      return parsedContract;
    } catch (error) {
      // Type guard for AWS S3 errors
      interface S3Error {
        $metadata?: {
          httpStatusCode?: number;
        };
      }

      // Check if error matches S3Error structure
      const isS3Error = (err: unknown): err is S3Error => {
        return (
          typeof err === 'object' && 
          err !== null && 
          '$metadata' in err &&
          typeof (err as S3Error).$metadata === 'object'
        );
      };

      if (isS3Error(error) && error.$metadata?.httpStatusCode === 404) {
        // Log a warning for missing files but don't throw
        console.warn(`Contract file not found for ID ${recordId}`);
        return null;
      }
      // For other errors, rethrow
      throw error;
    }
  } catch (error) {
    console.error(`Error fetching contract ${recordId} from S3:`, error);
    return null;
  }
}

async function searchContracts(userCredentials: Record<string, unknown>) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    if (!apiUrl) {
      throw new Error('API Gateway URL is not defined');
    }

    // Construct the actual summary text based on available user credentials
    let actualSummaryText = "";

    if (userCredentials.industry_sector) {
      actualSummaryText += `I am looking for contracts related to ${userCredentials.industry_sector}. `;
    }

    if (userCredentials.core_products_or_services) {
      actualSummaryText += `Our company provides ${userCredentials.core_products_or_services}. `;
    }

    if (userCredentials.unique_selling_proposition) {
      actualSummaryText += `We specialize in ${userCredentials.unique_selling_proposition}. `;
    }

    if (userCredentials.target_audience) {
      actualSummaryText += `Our target audience includes ${userCredentials.target_audience}.`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: actualSummaryText }),
    });

    // Log the response status and headers
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Log the response data
    console.log('Response Data:', data);

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { UserCredentials: true },
    });

    if (!user || !user.UserCredentials) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const searchResults = await searchContracts(user.UserCredentials as Record<string, unknown>);
    
    // Fetch full contract details for each record ID
    const contractPromises = (searchResults as SearchResult[]).map(result => 
      getContractFromS3(result.record_id)
    );

    const contracts = await Promise.all(contractPromises);
    const validContracts = contracts.filter((contract): contract is ContractDetails => 
      contract !== null
    );

    if (validContracts.length === 0) {
      return NextResponse.json({ 
        contracts: [] 
      });
    }

    // Update the formatting of contracts with detailed logging
    const formattedContracts = validContracts.map(contract => {
      // Log raw date values
      console.log('Processing contract dates:', {
        contractId: contract.notice_publication_id,
        rawDeadlineDate: contract.procedure.deadline_date,
        rawDeadlineTime: contract.procedure.deadline_time,
        rawPublishDate: contract.tendering_process.open_tender_date,
        rawPublishTime: contract.tendering_process.open_tender_time
      });

      // Parse the deadline date and time
      const deadlineDate = contract.procedure.deadline_date;
      const deadlineTime = contract.procedure.deadline_time;
      const deadlineDateString = `${deadlineDate}T${deadlineTime.split('+')[0]}Z`;
      const deadline = deadlineDate && deadlineTime 
        ? new Date(deadlineDateString)
        : null;

      // Parse the publication date and time
      const publishDate = contract.tendering_process.open_tender_date;
      const publishTime = contract.tendering_process.open_tender_time;
      const publishDateString = `${publishDate.split('+')[0]}T${publishTime.split('+')[0]}Z`;
      const published = publishDate && publishTime
        ? new Date(publishDateString)
        : null;

      // Log parsed dates
      console.log('Parsed dates:', {
        contractId: contract.notice_publication_id,
        deadlineDateString,
        parsedDeadline: deadline?.toISOString(),
        publishDateString,
        parsedPublished: published?.toISOString()
      });

      return {
        record_id: contract.notice_publication_id,
        title: contract.procedure.title,
        description: contract.procedure.description,
        amount: parseFloat(contract.value.estimated_value) || 0,
        currency: contract.value.currency,
        status: determineStatus(contract),
        match_percentage: calculateMatchPercentage(contract),
        eligibility: calculateEligibility(contract),
        published: published?.toISOString() || null,
        deadline: deadline?.toISOString() || null,
        buyer: {
          name: contract.buyer.official_name,
          email: contract.buyer.email,
          website: contract.buyer.website,
          location: {
            city: contract.buyer.address.city,
            country: contract.buyer.address.country,
          }
        }
      };
    }); // Add this closing parenthesis to complete the map function

    // Log final formatted contracts
    console.log('Final formatted contracts:', formattedContracts.map(contract => ({
      id: contract.record_id,
      published: contract.published,
      deadline: contract.deadline
    })));

    return NextResponse.json({
      contracts: formattedContracts
    });
  } catch (error) {
    console.error('Error in similarity search:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      contracts: [] 
    }, { status: 500 });
  }
}

// Helper functions
function determineStatus(contract: ContractDetails): 'green' | 'yellow' | 'red' {
  const value = parseFloat(contract.value.estimated_value) || 0;
  if (value > 1000000) return 'green';
  if (value > 500000) return 'yellow';
  return 'red';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculateMatchPercentage(_contract: ContractDetails): number {
  // TODO: Implement actual matching logic using contract details
  // For now, returning random number as placeholder
  return Math.floor(Math.random() * 40) + 60; // Returns a number between 60-100
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculateEligibility(_contract: ContractDetails): number {
  // TODO: Implement actual eligibility logic using contract details
  // For now, returning random number as placeholder
  return Math.floor(Math.random() * 30) + 70; // Returns a number between 70-100
}
