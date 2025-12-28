import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
  try {
    // 1️⃣ Auth check
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

    // 3️⃣ Fetch data
    const [orders, products] = await Promise.all([
      prisma.order.findMany({ where: { storeId } }),
      prisma.product.findMany({ where: { storeId } }),
    ]);

    const ratings = await prisma.rating.findMany({
      where: {
        productId: {
          in: products.map((p) => p.id),
        },
      },
      include: { user: true, product: true },
    });

    // 4️⃣ Safe calculations
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalEarnings = Math.round(
        orders.reduce((sum, o) => {
          return sum + Number(o.totalAmount || 0);
        }, 0)
      );

    // 5️⃣ Always return dashboardData
    const dashboardData = {
      ratings,
      totalOrders,
      totalEarnings,
      totalProducts,
    };

    return NextResponse.json({ dashboardData });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}