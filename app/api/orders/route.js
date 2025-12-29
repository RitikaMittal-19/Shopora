import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

/* ================================
   CREATE ORDER
================================ */
export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const { addressId, items, couponCode, paymentMethod } =
      await request.json();

    if (
      !addressId ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing order details" },
        { status: 400 }
      );
    }

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    /* ================================
       COUPON VALIDATION
    ================================ */
    let coupon = null;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon not found" },
          { status: 400 }
        );
      }

      if (coupon.forNewUser) {
        const previousOrders = await prisma.order.count({
          where: { userId },
        });

        if (previousOrders > 0) {
          return NextResponse.json(
            { error: "Coupon valid for new users only" },
            { status: 400 }
          );
        }
      }
    }

    const isPlusMember =
      typeof has === "function" ? has({ plan: "plus" }) : false;

    if (coupon?.forMember && !isPlusMember) {
      return NextResponse.json(
        { error: "Coupon valid for members only" },
        { status: 400 }
      );
    }

    /* ================================
       GROUP ITEMS BY STORE
    ================================ */
    const ordersByStore = new Map();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const storeId = product.storeId;

      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }

      ordersByStore.get(storeId).push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    /* ================================
       CREATE ORDERS
    ================================ */
    let orderIds = [];
    let fullAmount = 0;
    let shippingAdded = false;

    for (const [storeId, storeItems] of ordersByStore.entries()) {
      let total = storeItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      if (coupon) {
        total -= (total * coupon.discount) / 100;
      }

      if (!isPlusMember && !shippingAdded) {
        total += 5;
        shippingAdded = true;
      }

      total = Number(total.toFixed(2));
      fullAmount += total;

      const order = await prisma.order.create({
  data: {
    userId,
    storeId,
    addressId,
    total,
    paymentMethod,
    isCouponUsed: Boolean(coupon),
    coupon: coupon ?? {},   // ✅ FIX (matches Prisma schema)
    orderItems: {
      create: storeItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
});
      orderIds.push(order.id);
    }

    /* ================================
       STRIPE PAYMENT
    ================================ */
    if (paymentMethod === PaymentMethod.STRIPE) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const origin =
        request.headers.get("origin") ||
        process.env.NEXT_PUBLIC_APP_URL;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Order" },
              unit_amount: Math.round(fullAmount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/loading?nextUrl=orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
          orderIds: orderIds.join(","),
          userId,
          appId: "gocart",
        },
      });

      return NextResponse.json({ session });
    }

    /* ================================
       COD → CLEAR CART IMMEDIATELY
    ================================ */
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return NextResponse.json({
      message: "Orders placed successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

/* ================================
   GET USER ORDERS
================================ */
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          {
            AND: [
              { paymentMethod: PaymentMethod.STRIPE },
              { isPaid: true },
            ],
          },
        ],
      },
      include: {
        orderItems: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}