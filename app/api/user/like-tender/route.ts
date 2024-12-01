import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// For liking a tender
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { contractNoticeId } = await request.json();
    
    if (!contractNoticeId) {
      return new NextResponse("Contract notice ID is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Like the tender
    await prisma.likedContract.create({
      data: {
        userId: user.id,
        contractNoticeId,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('Error in like-tender:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// For unliking a tender
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contractNoticeId = searchParams.get('contractNoticeId');

    if (!contractNoticeId) {
      return new NextResponse("Contract notice ID is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Find and delete the like
    const existingLike = await prisma.likedContract.findFirst({
      where: {
        userId: user.id,
        contractNoticeId,
      },
    });

    if (!existingLike) {
      return new NextResponse("Like not found", { status: 404 });
    }

    await prisma.likedContract.delete({
      where: {
        id: existingLike.id,
      },
    });

    return NextResponse.json({ liked: false });
  } catch (error) {
    console.error('Error in unlike-tender:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
