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

const COUNTRY_CODE_MAP: { [key: string]: string } = {
  'ITA': 'Italy',
  'ESP': 'Spain', 
  'IRL': 'Ireland',
  'NOR': 'Norway',
  'FRA': 'France',
  'DEU': 'Germany',
  'NLD': 'Netherlands',
  'BEL': 'Belgium',
  'POL': 'Poland',
  'PRT': 'Portugal',
  'ROU': 'Romania',
  'AUT': 'Austria',
  'SWE': 'Sweden',
  'FIN': 'Finland',
  'DNK': 'Denmark',
  'CZE': 'Czech-republic',
  'GRC': 'Greece',
  'BGR': 'Bulgaria',
  'HRV': 'Croatia',
  'SVK': 'Slovakia',
  'LTU': 'Lithuania',
  'LVA': 'Latvia',
  'EST': 'Estonia',
  'CYP': 'Cyprus',
  'HUN': 'Hungary',
  'SVN': 'Slovenia',
  'LUX': 'Luxembourg',
  'MLT': 'Malta'
};

function getCountryCode(countryName: string): string | null {
  if (!countryName) return null;
  
  const normalizedCountryName = countryName.toLowerCase().trim();
  
  // Direct mapping for common variations
  const specialCases: { [key: string]: string } = {
    'ireland': 'IRL',
    'italy': 'ITA',
    'spain': 'ESP',
    'norway': 'NOR',
    'france': 'FRA',
    'germany': 'DEU',
    'netherlands': 'NLD',
    'belgium': 'BEL',
    'poland': 'POL',
    'portugal': 'PRT',
    'romania': 'ROU',
    'austria': 'AUT',
    'sweden': 'SWE',
    'finland': 'FIN',
    'denmark': 'DNK',
    'czech republic': 'CZE',
    'czech-republic': 'CZE',
    'greece': 'GRC',
    'bulgaria': 'BGR',
    'croatia': 'HRV',
    'slovakia': 'SVK',
    'lithuania': 'LTU',
    'latvia': 'LVA',
    'estonia': 'EST',
    'cyprus': 'CYP',
    'hungary': 'HUN',
    'slovenia': 'SVN',
    'luxembourg': 'LUX',
    'malta': 'MLT'
  };

  // Check for direct match in special cases
  if (specialCases[normalizedCountryName]) {
    return specialCases[normalizedCountryName];
  }

  // Fallback to original mapping if needed
  for (const [code, name] of Object.entries(COUNTRY_CODE_MAP)) {
    if (name.toLowerCase() === normalizedCountryName) {
      return code;
    }
  }

  console.log(`Could not map country name: "${countryName}" to a country code`);
  return null;
}

async function hybridSearchContracts(searchText: string, primaryFocus: string = 'all'): Promise<HybridSearchApiResponse[]> {
  try {
    console.log('Starting searchContracts function...');
    const apiUrl = process.env.HYBRID_SEARCH_API_GATEWAY_URL_LOT;

    if (!apiUrl) {
      console.error('API Gateway URL is missing in environment variables');
      throw new Error('API Gateway URL is not defined');
    }

    console.log('Search text received:', searchText);
    console.log('Primary focus:', primaryFocus);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: searchText,
        alpha: 0.8,
        score_cutoff: 0.5,
        primaryFocus: primaryFocus
      }),
    });

    const responseData = await response.json();

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

    // Get user with liked contracts and company information
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        likedContracts: true,
        company: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get primaryFocus from company or default to 'all'
    const primaryFocus = user.company?.primaryFocus?.toLowerCase() || 'all';
    
    // Validate primaryFocus
    const validFocuses = ['supplies', 'works', 'services', 'all'];
    const validatedFocus = validFocuses.includes(primaryFocus) ? primaryFocus : 'all';

    const searchResults = await hybridSearchContracts(searchText, validatedFocus);
    console.log('Search Results:', searchResults);

    const noticeIds = searchResults.map(result => result.notice_id.split('_')[0]);
    const contractDetails = await fetchContractDetails(noticeIds, request.headers);

    // Create a Set of liked contract IDs for efficient lookup
    const likedContractIds = new Set(user.likedContracts.map(lc => lc.contractNoticeId));

    // Get user's company country code with enhanced logging
    const userLocation = user.company?.primaryLocation;
    
    const userCountryCode = userLocation ? getCountryCode(userLocation) : null;

    // Combine search results with contract details and liked status
    const formattedContracts = contractDetails.map((contract: SearchResult) => {
      const searchResult = searchResults.find(sr => sr.notice_id === contract.notice_id);
      return {
        ...contract,
        rank: searchResult?.rank,
        score: searchResult?.score,
        submission_deadline_date: searchResult?.metadata.submission_deadline_date,
        match_percentage: calculateMatchPercentage(),
        is_liked: likedContractIds.has(contract.notice_id)
      };
    });

    // Sort contracts to prioritize user's country if available
    if (userCountryCode) {

      formattedContracts.sort((a, b) => {
        const aIsUserCountry = a.country === userCountryCode;
        const bIsUserCountry = b.country === userCountryCode;

        if (aIsUserCountry && !bIsUserCountry) return -1;
        if (!aIsUserCountry && bIsUserCountry) return 1;
        return 0;
      });
    }

    return NextResponse.json({ 
      contracts: formattedContracts,
      debug: {
        userCountry: userLocation,
        userCountryCode,
        contractCountries: formattedContracts.map(c => c.country)
      }
    });

  } catch (error) {
    console.error('Error in hybrid search:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      contracts: [] 
    }, { status: 500 });
  }
}

function calculateMatchPercentage(): number {
  return Math.floor(Math.random() * 40) + 60; // Returns 60-100
}