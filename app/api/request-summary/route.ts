import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RequestData {
  tenderId: string;
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: RequestData = await req.json();
    const { tenderId } = body;

    if (!tenderId) {
      return NextResponse.json(
        { error: 'tenderId is required' },
        { status: 400 }
      );
    }
    
    const clerkId = clerkUser.id;
    const userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress || '';

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update the liked contract record
    await prisma.likedContract.upsert({
      where: {
        userId_contractNoticeId: {
          userId: user.id,
          contractNoticeId: tenderId,
        },
      },
      create: {
        userId: user.id,
        contractNoticeId: tenderId,
        requestedSummary: true,
      },
      update: {
        requestedSummary: true,
      },
    });

    // Send request to Make webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('MAKE_WEBHOOK_URL environment variable is not configured');
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenderId,
        clerkUserId: clerkId,
        userFullName: userName,
        userEmail: userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}