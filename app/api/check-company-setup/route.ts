import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clerkUserId = searchParams.get('userId');

  if (!clerkUserId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // First get the user
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: { company: true },
    });

    return NextResponse.json({
      hasCompany: !!user?.company,
    });
  } catch (error) {
    console.error('Error checking company setup:', error);
    return NextResponse.json(
      { error: 'Failed to check company setup' },
      { status: 500 }
    );
  }
} 