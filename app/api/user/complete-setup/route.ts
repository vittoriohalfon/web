import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedbackSource, goal } = await req.json();

    if (!feedbackSource || !goal) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Update user preferences and mark setup as complete
    await prisma.$transaction([
      prisma.userPreference.upsert({
        where: { userId: user.id },
        update: {
          goal,
          referralSource: feedbackSource
        },
        create: {
          userId: user.id,
          goal,
          referralSource: feedbackSource
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { setupComplete: true }
      })
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Setup completed successfully' 
    });

  } catch (error) {
    console.error('Error completing setup:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
