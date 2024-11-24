import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Company } from '@prisma/client';

interface SearchResult {
  record_id: string;
  title: string;
  description: string;
  estimated_value: number;
  currency: string;
  buyer: {
    name: string;
    email: string;
    website: string;
    location: {
      city: string;
      country: string;
    }
  };
  deadline: string;
  published: string;
  lot_count: number;
}

interface ParsedContract {
  noticeId: string;
  lotId: string;
}

function parseRecordId(recordId: string): ParsedContract {
  const [noticeId, lotId] = recordId.split('_');
  return { noticeId, lotId };
}

async function searchContracts(user: { company: Company | null }) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    console.log('API URL:', apiUrl);

    if (!apiUrl) {
      throw new Error('API Gateway URL is not defined');
    }

    if (!user.company) {
      throw new Error('Company profile not found');
    }

    // Construct a more concise search text using company information
    const searchText = [
      user.company.industrySector && `Industry: ${user.company.industrySector}.`,
      user.company.coreProductsServices && `Products/Services: ${user.company.coreProductsServices}.`,
      user.company.uniqueSellingPoint && `Specialization: ${user.company.uniqueSellingPoint}.`,
      user.company.geographicFocus && `Location: ${user.company.geographicFocus}.`,
    ]
      .filter(Boolean)
      .join(' ')
      .slice(0, 1000); // Limit text to 1000 characters

    console.log('Search Text:', searchText);

    const requestBody = { text: searchText };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error || `API request failed with status ${response.status}`);
    }

    return responseData || [];
  } catch (error) {
    console.error('Error in searchContracts:', error);
    throw error;
  }
}

async function fetchContractDetails(records: ParsedContract[], headers: Headers) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header present');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/contract-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ contracts: records }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch contract details: ${response.status} - ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.contracts;
  } catch (error) {
    console.error('Error fetching contract details:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the headers from the incoming request
    const headers = request.headers;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get similarity search results
    const searchResults = await searchContracts(user);
    
    // Parse the record IDs into notice and lot IDs
    const parsedRecords = searchResults
      .map((result: { record_id: string }) => parseRecordId(result.record_id));

    // Pass the headers to fetchContractDetails
    const contractDetails = await fetchContractDetails(parsedRecords, headers);
    
    const formattedContracts = contractDetails.map((contract: any) => ({
      record_id: contract.record_id,
      title: contract.title,
      description: contract.description,
      amount: contract.estimated_value,
      currency: contract.currency,
      country: contract.country,
      status: determineStatus(contract.estimated_value),
      match_percentage: calculateMatchPercentage(),
      published: contract.published,
      lot_count: contract.lot_count,
      deadline: contract.deadline,
      buyer: contract.buyer
    }));

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
function determineStatus(value: number): 'green' | 'yellow' | 'red' {
  if (value > 1000000) return 'green';
  if (value > 500000) return 'yellow';
  return 'red';
}

function calculateMatchPercentage(): number {
  return Math.floor(Math.random() * 40) + 60; // Returns 60-100
}
