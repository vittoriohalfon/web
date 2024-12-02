import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface HybridSearchApiResponse {
  rank: number;
  notice_id: string;
  score: number;
  metadata: {
    submission_deadline_date: string;
  };
}

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

async function hybridSearchContracts(searchText: string): Promise<HybridSearchApiResponse[]> {
  try {
    console.log('Starting searchContracts function...');
    const apiUrl = process.env.HYBRID_SEARCH_API_GATEWAY_URL;

    if (!apiUrl) {
      console.error('API Gateway URL is missing in environment variables');
      throw new Error('API Gateway URL is not defined');
    }

    console.log('Search text received:', searchText);
    console.log('Making API request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: searchText }),
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.json();
    console.log('API Response Data:', responseData);

    if (!response.ok) {
      console.error('API request failed:', {
        status: response.status,
        data: responseData,
        url: apiUrl
      });
      throw new Error(responseData.error || `API request failed with status ${response.status}`);
    }

    return responseData as HybridSearchApiResponse[];
  } catch (error) {
    console.error('Detailed error in searchContracts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
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

    const body = await request.json();
    const { searchText } = body;

    if (!searchText) {
      return NextResponse.json({ error: 'Search text is required' }, { status: 400 });
    }

    // Get user with liked contracts
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { likedContracts: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchResults = await hybridSearchContracts(searchText);
    console.log('Search Results:', searchResults);

    const noticeIds = searchResults.map(result => result.notice_id);
    const contractDetails = await fetchContractDetails(noticeIds, request.headers);

    // Create a Set of liked contract IDs for efficient lookup
    const likedContractIds = new Set(user.likedContracts.map(lc => lc.contractNoticeId));

    // Combine search results with contract details and liked status
    const formattedContracts = contractDetails.map((contract: SearchResult) => {
      const searchResult = searchResults.find(sr => sr.notice_id === contract.notice_id);
      return {
        ...contract,
        rank: searchResult?.rank,
        score: searchResult?.score,
        submission_deadline_date: searchResult?.metadata.submission_deadline_date,
        is_liked: likedContractIds.has(contract.notice_id)
      };
    });
    
    return NextResponse.json({ 
      contracts: formattedContracts 
    });
  } catch (error) {
    console.error('Error in hybrid search:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      contracts: [] 
    }, { status: 500 });
  }
}
