import prisma from "@/lib/prisma";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // REQUIRED for Stripe
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });

    event = stripe.webhooks.constructEvent(
      buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 STRIPE WEBHOOK HIT:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const { orderIds, userId, appId } = session.metadata || {};

      if (appId === "gocart" && orderIds && userId) {
        const ids = orderIds.split(",");

        await prisma.order.updateMany({
          where: {
            id: { in: ids },
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
    }
  }

  res.json({ received: true });
}