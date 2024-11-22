import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Pool } from 'pg';

// Create a connection pool to the AWS database
const pool = new Pool({
  host: process.env.AWS_DB_HOST,
  database: process.env.AWS_DB_NAME,
  user: process.env.AWS_DB_USER,
  password: process.env.AWS_DB_PASS,
  port: parseInt(process.env.AWS_DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
});

interface ContractRequest {
  contracts: Array<{
    noticeId: string;
    lotId: string;
  }>;
}

interface ContractDetailsResponse {
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
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contracts } = (await request.json()) as ContractRequest;
    
    if (!Array.isArray(contracts)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Create the parameterized values for the query
    const values = contracts.flatMap((c, i) => [c.noticeId, c.lotId]);
    const placeholders = contracts
      .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
      .join(',');

    const query = `
      WITH buyer_info AS (
        SELECT 
          o.org_id,
          o.name as buyer_name,
          o.website_url as buyer_website,
          c.email as buyer_email,
          a.city as buyer_city,
          a.country_code as buyer_country
        FROM organizations o
        LEFT JOIN contacts c ON o.org_id = c.org_id
        LEFT JOIN addresses a ON o.org_id = a.org_id
        WHERE o.org_id IN (
          SELECT org_id 
          FROM organization_roles 
          WHERE notice_id IN (SELECT n.notice_id FROM base_notices n WHERE n.notice_id = ANY(SELECT x.notice_id FROM (VALUES ${placeholders}) as x(notice_id, lot_id)))
          AND role_type_general = 'buyer'
        )
      )
      SELECT 
        CONCAT(l.notice_id, '_', l.lot_id) as record_id,
        bn.title,
        l.description,
        l.estimated_value,
        cn.currency_code as currency,
        bi.buyer_name,
        bi.buyer_email,
        bi.buyer_website,
        bi.buyer_city,
        bi.buyer_country,
        cn.submission_deadline_date as deadline,
        bn.issue_date as published
      FROM lots l
      JOIN base_notices bn ON l.notice_id = bn.notice_id
      JOIN contract_notices cn ON bn.notice_id = cn.notice_id
      LEFT JOIN buyer_info bi ON TRUE
      WHERE (l.notice_id, l.lot_id) IN (VALUES ${placeholders})
    `;

    const result = await pool.query(query, values);
    
    const contractDetails = result.rows.map(row => ({
      record_id: row.record_id,
      title: row.title,
      description: row.description,
      estimated_value: parseFloat(row.estimated_value),
      currency: row.currency,
      buyer: {
        name: row.buyer_name,
        email: row.buyer_email,
        website: row.buyer_website,
        location: {
          city: row.buyer_city,
          country: row.buyer_country
        }
      },
      deadline: row.deadline?.toISOString(),
      published: row.published?.toISOString()
    }));

    return NextResponse.json({ contracts: contractDetails });
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      contracts: [] 
    }, { status: 500 });
  }
} 