import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Company } from '@prisma/client';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SearchResult {
  notice_id: string;
  title: string;
  description: string;
  estimated_value: number;
  country: string;
  currency: string;
  deadline: string;
  published: string;
  lot_count: number;
  is_liked: boolean;
}

interface SearchApiResponse {
  record_id: string;
}

async function searchContracts(user: { company: Company | null }): Promise<SearchApiResponse[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

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

    return responseData as SearchApiResponse[];
  } catch (error) {
    console.error('Error in searchContracts:', error);
    throw error;
  }
}

async function fetchContractDetails(noticeIds: string[], headers: Headers): Promise<SearchResult[]> {
  try {
    const authHeader = headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header present');
    }

    const response = await fetch(`${DOMAIN}/api/aurora/contract-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ 
        contracts: noticeIds.map(noticeId => ({ noticeId }))
      }),
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

    const headers = request.headers;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        company: true,
        likedContracts: true 
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const searchResults = await searchContracts(user);
    const noticeIds = searchResults.map((result) => 
      result.record_id.split('_')[0]
    );
    const uniqueNoticeIds = [...new Set(noticeIds)];

    const likedContractIds = new Set(user.likedContracts.map(lc => lc.contractNoticeId));

    const contractDetails = await fetchContractDetails(uniqueNoticeIds, headers);
    
    const formattedContracts = contractDetails.map((contract: SearchResult) => ({
      notice_id: contract.notice_id,
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
      is_liked: likedContractIds.has(contract.notice_id)
    }));

    console.log('Formatted Contracts:', formattedContracts);
    
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
