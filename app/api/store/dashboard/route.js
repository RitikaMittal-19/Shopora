import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { PaymentMethod } from "@prisma/client";

export async function GET(request) {
  try {
    // 1️⃣ Auth
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Seller check
    const seller = await authSeller(userId);

    if (!seller || !seller.storeId) {
      return NextResponse.json(
        { error: "Seller not authorized" },
        { status: 403 }
      );
    }

    const storeId = seller.storeId;

    // 3️⃣ Fetch PAID orders only
    const orders = await prisma.order.findMany({
      where: {
        storeId,
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
    });

    // 4️⃣ Fetch products
    const products = await prisma.product.findMany({
      where: { storeId },
    });

    // 5️⃣ Fetch ratings
    const ratings = await prisma.rating.findMany({
      where: {
        productId: {
          in: products.map((p) => p.id),
        },
      },
      include: {
        user: true,
        product: true,
      },
    });

    // 6️⃣ Calculations (FIXED)
    const totalOrders = orders.length;
    const totalProducts = products.length;

    const totalEarnings = Number(
      orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)
    );

    // 7️⃣ Response
    return NextResponse.json({
      dashboardData: {
        totalOrders,
        totalProducts,
        totalEarnings,
        ratings,
      },
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}