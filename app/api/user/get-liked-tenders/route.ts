import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's ID from the database using their Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const likedContracts = await prisma.likedContract.findMany({
      where: {
        userId: user.id, // Using the numeric user ID from our database
      },
      select: {
        contractNoticeId: true,
      },
    });

    const noticeIds = likedContracts.map(contract => contract.contractNoticeId);

    return NextResponse.json({ noticeIds });
  } catch (error) {
    console.error("[GET_LIKED_TENDERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
