import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST() {
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
      } as Prisma.UserInclude,
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user already has an active subscription
    const hasActiveSubscription = user.subscriptions.some(
      (sub: { status: string }) => sub.status === "active"
    );

    if (hasActiveSubscription) {
      return new NextResponse("Already subscribed", { status: 403 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${DOMAIN}/dashboard?success=true`,
      cancel_url: `${DOMAIN}/dashboard?canceled=true`,
      metadata: {
        userId: user.id.toString(),
      },
      customer_email: user.email,
    });

    if (!session.url) {
      return new NextResponse("Failed to create session", { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
