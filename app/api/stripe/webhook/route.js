export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export async function POST(request) {
  console.log("🔥 STRIPE WEBHOOK HIT");

  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const metadata = session.metadata;

      if (!metadata || !metadata.orderIds || !metadata.userId) {
        console.error("❌ Missing metadata:", metadata);
        return NextResponse.json({ received: true });
      }

      const { orderIds, userId, appId } = metadata;

      if (appId !== "gocart") {
        return NextResponse.json({ received: true });
      }

      const orderIdsArray = orderIds.split(",");

      await prisma.order.updateMany({
        where: {
          id: { in: orderIdsArray },
          isPaid: false,
        },
        data: { isPaid: true },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { cart: {} },
      });

      console.log("✅ Orders paid & cart cleared");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Stripe webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}