import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    if (!signature) {
      return new NextResponse("No signature found", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (error) {
      const stripeError = error as Error;
      return new NextResponse(`Webhook Error: ${stripeError.message || "Unknown error"}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscriptionId = session.subscription as string;
      if (!subscriptionId || !session.metadata?.userId) {
        return new NextResponse("Missing subscription or user ID metadata", { status: 400 });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      await prisma.subscription.create({
        data: {
          userId: parseInt(session.metadata.userId, 10),
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: subscription.status,
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};