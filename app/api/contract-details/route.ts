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
  }>;
}

interface ContractDetailsResponse {
  notice_id: string;
  title: string;
  description: string;
  estimated_value: number;
  currency: string;
  country: string;
  deadline: string;
  published: string;
  lot_count: number;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Extract the contracts array from the body
    const { contracts } = body;
    
    if (!Array.isArray(contracts)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Extract unique notice IDs directly from noticeId field
    const uniqueNoticeIds = [...new Set(
      contracts.map(c => c.noticeId)
    )];

    console.log('Unique Notice IDs:', uniqueNoticeIds);

    if (uniqueNoticeIds.length === 0) {
      return NextResponse.json({ contracts: [] });
    }

    // Create the parameterized query
    const placeholders = uniqueNoticeIds.map((_, i) => `$${i + 1}`).join(',');
    
    const query = `
      SELECT
        bn.notice_id,
        bn.title,
        bn.description,
        bn.issue_date as published,
        cn.estimated_total_value as estimated_value,
        cn.currency_code as currency,
        cn.submission_deadline_date as deadline,
        rl.country_code as country,
        COUNT(l.lot_id) AS lot_count
      FROM base_notices bn
      JOIN contract_notices cn ON bn.notice_id = cn.notice_id
      LEFT JOIN realized_locations rl ON bn.notice_id = rl.notice_id
      LEFT JOIN lots l ON bn.notice_id = l.notice_id
      WHERE bn.notice_id IN (${placeholders})
      GROUP BY
        bn.notice_id,
        bn.title,
        bn.description,
        bn.issue_date,
        cn.estimated_total_value,
        cn.currency_code,
        cn.submission_deadline_date,
        rl.country_code
    `;

    // Log the query and parameters for debugging
    console.log('Query:', query);
    console.log('Parameters:', uniqueNoticeIds);

    const result = await pool.query(query, uniqueNoticeIds);
    
    // Log the query results
    console.log('Query results:', result.rows);

    const contractDetails = result.rows.map(row => ({
      notice_id: row.notice_id,
      title: row.title,
      description: row.description,
      estimated_value: parseFloat(row.estimated_value),
      currency: row.currency,
      country: row.country,
      deadline: row.deadline?.toISOString(),
      published: row.published?.toISOString(),
      lot_count: row.lot_count ? parseInt(row.lot_count, 10) : 1
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