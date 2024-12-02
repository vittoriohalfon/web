import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Company } from '@prisma/client';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

async function searchContracts(user: { company: Company | null }): Promise<SearchApiResponse[]> {
  try {
    console.log('Starting searchContracts function...');
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

    if (!apiUrl) {
      console.error('API Gateway URL is missing in environment variables');
      throw new Error('API Gateway URL is not defined');
    }

    if (!user.company) {
      console.error('User company data is missing:', user);
      throw new Error('Company profile not found');
    }

    // Construct search text with logging
    console.log('Company data:', {
      sector: user.company.industrySector,
      products: user.company.coreProductsServices,
      usp: user.company.uniqueSellingPoint,
      geo: user.company.geographicFocus
    });

    const searchText = [
      user.company.industrySector && `Industry: ${user.company.industrySector}.`,
      user.company.coreProductsServices && `Products/Services: ${user.company.coreProductsServices}.`,
      user.company.uniqueSellingPoint && `Specialization: ${user.company.uniqueSellingPoint}.`,
      user.company.geographicFocus && `Location: ${user.company.geographicFocus}.`,
    ]
      .filter(Boolean)
      .join(' ')
      .slice(0, 1000);

    console.log('Constructed search text:', searchText);
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

    return responseData as SearchApiResponse[];
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
    
    // Get user's company country code
    const userLocation = user.company?.primaryLocation;
    console.log('Raw user location from database:', userLocation);
    
    const userCountryCode = userLocation ? getCountryCode(userLocation) : null;
    console.log('Mapped user country code:', userCountryCode);

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

    console.log('Formatted Contracts:', formattedContracts);
    
    return NextResponse.json({
      contracts: formattedContracts,
      debug: {
        userCountry: userLocation,
        userCountryCode,
        contractCountries: formattedContracts.map(c => c.country)
      }
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
