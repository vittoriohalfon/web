import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        subscriptions: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const hasActiveSubscription = user.subscriptions.some(
      (sub: { status: string }) => sub.status === "active"
    );

    return NextResponse.json({ hasActiveSubscription });
  } catch (error) {
    console.error("[SUBSCRIPTION_STATUS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 