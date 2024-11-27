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
    attachmentUri: string;
    lots: Array<{
        lotId: string;
        title: string;
        description: string;
        procurementType: string;
        estimatedValue: number;
    }>;
    buyers: Array<{
        name: string;
        website: string;
        phone: string;
        email: string;
        address_city: string;
        address_street: string;
        address_postal: string;
        address_country: string;
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
        cn.submission_deadline_date as deadline,
        cn.attachment_uri
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

    const buyersQuery = `
      SELECT DISTINCT ON (o.company_id)
        o.name AS organization_name,
        o.website_url AS organization_website,
        c.phone AS contact_phone,
        c.email AS contact_email,
        a.city AS address_city,
        a.street_name AS address_street_name,
        a.postal_code AS address_postal_code,
        a.country_code AS address_country_code
      FROM 
        public.organizations o
      JOIN 
        public.notice_organizations no 
      ON 
        o.company_id = no.company_id
      LEFT JOIN 
        public.contacts c 
      ON 
        o.company_id = c.company_id
      LEFT JOIN 
        public.addresses a 
      ON 
        o.company_id = a.company_id
      WHERE 
        no.notice_id = $1
      ORDER BY 
        o.company_id`;

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
      attachmentUri: contract.attachment_uri || '',
      lots: lotsResult.rows.map(lot => ({
        lotId: lot.lot_id,
        title: decodeSpecialCharacters(lot.title),
        description: decodeSpecialCharacters(lot.description),
        procurementType: lot.procurementType,
        estimatedValue: parseFloat(lot.estimated_value)
      })),
      buyers: buyersResult.rows.map(buyer => ({
        name: decodeSpecialCharacters(buyer.organization_name) || '',
        website: buyer.organization_website || '',
        phone: buyer.contact_phone || '',
        email: buyer.contact_email || '',
        address_city: buyer.address_city || '',
        address_street: buyer.address_street_name || '',
        address_postal: buyer.address_postal_code || '',
        address_country: buyer.address_country_code || ''
      }))
    };

    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}