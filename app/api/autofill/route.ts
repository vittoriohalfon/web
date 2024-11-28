import { NextRequest, NextResponse } from 'next/server';
import { processDomainInfo, type DomainInfoResult } from '@/utils/findInfo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    console.log("Received request with domain:", domain);

    if (!domain) {
      console.error("No domain provided");
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const results: DomainInfoResult[] = await processDomainInfo(domain);
    console.log("Processed results:", results);

    return NextResponse.json({ results }, { status: 200 });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing domain:', error);
      return NextResponse.json(
        { error: 'Failed to process domain information', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error processing domain:', error);
      return NextResponse.json(
        { error: 'Failed to process domain information', details: 'Unknown error' },
        { status: 500 }
      );
    }
  }
}
