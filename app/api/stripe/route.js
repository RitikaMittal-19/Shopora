import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
})

export async function POST(request) {
  try {
    const body = await request.text()
    const sig = request.headers.get("stripe-signature")

    if (!sig) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    // ✅ Handle successful checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      const { orderIds, userId, appId } = session.metadata || {}

      if (appId !== "gocart") {
        return NextResponse.json({ received: true })
      }

      const orderIdsArray = orderIds?.split(",") || []

      // Mark orders as paid
      await Promise.all(
        orderIdsArray.map((orderId) =>
          prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true },
          })
        )
      )

      // Clear user cart
      await prisma.user.update({
        where: { id: userId },
        data: { cart: {} },
      })
    }

    // ❌ Optional: handle failed payments
    if (event.type === "checkout.session.expired") {
      const session = event.data.object
      const { orderIds } = session.metadata || {}

      const orderIdsArray = orderIds?.split(",") || []

      await Promise.all(
        orderIdsArray.map((orderId) =>
          prisma.order.delete({ where: { id: orderId } })
        )
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}