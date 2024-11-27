import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { decodeSpecialCharacters } from '@/utils/decodeSpecialChars';

interface LikedBasicContractRequest {
  noticeId: string;
}

interface LikedBasicContractResponse {
    noticeId: string;
    noticePublicationId: string;
    title: string;
    description: string;
    estimatedValue: number;
    currency: string;
    country: string;
    published: string;
    deadline: string;
    lot_count: number; 
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { noticeId }: LikedBasicContractRequest = body;

    if (!noticeId) {
      return NextResponse.json({ error: 'Notice ID is required' }, { status: 400 });
    }

    // Simplified main query to get exactly what we need
    const contractQuery = `
      SELECT 
        bn.notice_id,
        COALESCE(p.notice_publication_id, '') as notice_publication_id,
        bn.title,
        bn.description,
        COALESCE(cn.estimated_total_value, 0) as estimated_value,
        COALESCE(cn.currency_code, '') as currency,
        COALESCE(rl.country_code, '') as country,
        bn.issue_date as published,
        cn.submission_deadline_date as deadline,
        (
          SELECT COUNT(*)
          FROM lots l
          WHERE l.notice_id = bn.notice_id
        ) as lot_count
      FROM base_notices bn
      LEFT JOIN contract_notices cn ON bn.notice_id = cn.notice_id
      LEFT JOIN realized_locations rl ON bn.notice_id = rl.notice_id
      LEFT JOIN publications p ON bn.notice_id = p.notice_id
      WHERE bn.notice_id = $1
      LIMIT 1
    `;

    const contractResult = await db.query(contractQuery, [noticeId]);

    if (contractResult.rows.length === 0) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const contract = contractResult.rows[0];
    const response: LikedBasicContractResponse = {
      noticeId: contract.notice_id,
      noticePublicationId: contract.notice_publication_id,
      title: decodeSpecialCharacters(contract.title),
      description: decodeSpecialCharacters(contract.description),
      estimatedValue: parseFloat(contract.estimated_value) || 0,
      currency: contract.currency,
      country: contract.country,
      published: contract.published?.toISOString() || null,
      deadline: contract.deadline?.toISOString() || null,
      lot_count: parseInt(contract.lot_count) || 0
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching contract details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}