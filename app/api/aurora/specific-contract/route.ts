import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { decodeSpecialCharacters } from '@/utils/decodeSpecialChars';

interface SpecificContractRequest {
  noticeId: string;
}

interface SpecificContractResponse {
    noticeId: string;
    noticePublicationId: string;
    title: string;
    description: string;
    estimatedValue: number;
    currency: string;
    country: string;
    published: string;
    deadline: string;
    lots: Array<{
        lotId: string;
        title: string;
        description: string;
        procurementType: string;
        estimatedValue: number;
    }>;
    buyers: Array<{
        name: string;
        address: string;
        phone: string;
        email: string;
        website: string;
    }>;   
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { noticeId }: SpecificContractRequest = body;

    if (!noticeId) {
      return NextResponse.json({ error: 'Notice ID is required' }, { status: 400 });
    }

    // Main contract details query
    const contractQuery = `
      SELECT 
        bn.notice_id,
        p.notice_publication_id,
        bn.title,
        bn.description,
        cn.estimated_total_value as estimated_value,
        cn.currency_code as currency,
        rl.country_code as country,
        bn.issue_date as published,
        cn.submission_deadline_date as deadline
      FROM base_notices bn
      JOIN contract_notices cn ON bn.notice_id = cn.notice_id
      LEFT JOIN realized_locations rl ON bn.notice_id = rl.notice_id
      LEFT JOIN publications p ON bn.notice_id = p.notice_id
      WHERE bn.notice_id = $1
    `;

    // Lots query
    const lotsQuery = `
      SELECT 
        lot_id,
        title,
        description,
        estimated_value,
        procurement_type as "procurementType"
      FROM lots
      WHERE notice_id = $1
    `;

    // Buyers query - simplified to get all organizations for contract notices
    const buyersQuery = `
      SELECT DISTINCT
        o.name,
        CONCAT(
          COALESCE(a.street_name, ''), ', ',
          COALESCE(a.city, ''), ', ',
          COALESCE(a.postal_code, ''), ', ',
          COALESCE(a.country_code, '')
        ) as address,
        c.phone,
        c.email,
        o.website_url as website
      FROM base_notices bn
      JOIN organizations o ON bn.contract_folder_id = o.org_id
      LEFT JOIN addresses a ON o.org_id = a.org_id
      LEFT JOIN contacts c ON o.org_id = c.org_id
      WHERE bn.notice_id = $1
    `;

    const [contractResult, lotsResult, buyersResult] = await Promise.all([
      db.query(contractQuery, [noticeId]),
      db.query(lotsQuery, [noticeId]),
      db.query(buyersQuery, [noticeId])
    ]);

    if (contractResult.rows.length === 0) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const contract = contractResult.rows[0];
    const response: SpecificContractResponse = {
      noticeId: contract.notice_id,
      noticePublicationId: contract.notice_publication_id,
      title: decodeSpecialCharacters(contract.title),
      description: decodeSpecialCharacters(contract.description),
      estimatedValue: parseFloat(contract.estimated_value),
      currency: contract.currency,
      country: contract.country,
      published: contract.published?.toISOString(),
      deadline: contract.deadline?.toISOString(),
      lots: lotsResult.rows.map(lot => ({
        lotId: lot.lot_id,
        title: decodeSpecialCharacters(lot.title),
        description: decodeSpecialCharacters(lot.description),
        procurementType: lot.procurementType,
        estimatedValue: parseFloat(lot.estimated_value)
      })),
      buyers: buyersResult.rows.map(buyer => ({
        name: decodeSpecialCharacters(buyer.name),
        address: decodeSpecialCharacters(buyer.address),
        phone: buyer.phone || '',
        email: buyer.email || '',
        website: buyer.website || ''
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}