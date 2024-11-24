import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

interface ContractRequest {
  contracts: Array<{
    noticeId: string;
    lotId?: string;
  }>;
}

interface ContractDetailsResponse {
  record_id?: string;
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

// Add this helper function at the top of the file
function decodeSpecialCharacters(text: string): string {
  if (!text) return '';
  
  return text
    // Handle multiple 'à' variations
    .replace(/Ã\x83\x83\x83\x83Ã\x83\x83\x82Ã\x83\x82Ã\x82Â /g, 'à')
    .replace(/Ã\x83/g, 'à')
    .replace(/Ã /g, 'à')
    .replace(/àààÃÂ/g, 'à')
    .replace(/ààà/g, 'à')
    .replace(/àÃÂ/g, 'à')
    
    // Handle 'á' variations
    .replace(/Ã¡/g, 'á')
    
    // Handle other common Italian special characters
    .replace(/Ã¨/g, 'è')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¬/g, 'ì')
    .replace(/Ã­/g, 'í')
    .replace(/Ã²/g, 'ò')
    .replace(/Ã³/g, 'ó')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã¼/g, 'ü')
    
    // Clean up any remaining encoded sequences
    .replace(/Ã[A-Za-z\d]/g, '')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    
    // Clean up any remaining ÃÂ sequences
    .replace(/ÃÂ/g, '')
    
    // Normalize multiple consecutive special characters
    .replace(/([àáèéìíòóùü])\1+/g, '$1')
    
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    
    // Final trim to remove any extra spaces
    .trim();
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

    const result = await db.query(query, uniqueNoticeIds);
    
    // Log the query results
    console.log('Query results:', result.rows);

    const contractDetails = result.rows.map(row => {
      // Find the original contract request to get the lotId
      const originalContract = contracts.find(c => c.noticeId === row.notice_id);
      const record_id = originalContract?.lotId ? 
        `${row.notice_id}_${originalContract.lotId}` : 
        row.notice_id;

      return {
        record_id,
        notice_id: row.notice_id,
        title: decodeSpecialCharacters(row.title),
        description: decodeSpecialCharacters(row.description),
        estimated_value: parseFloat(row.estimated_value),
        currency: row.currency,
        country: row.country,
        deadline: row.deadline?.toISOString(),
        published: row.published?.toISOString(),
        lot_count: row.lot_count ? parseInt(row.lot_count, 10) : 1
      };
    });

    return NextResponse.json({ contracts: contractDetails });
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      contracts: [] 
    }, { status: 500 });
  }
} 