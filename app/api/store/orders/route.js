// app/api/store/orders/route.js

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

/* ======================================================
   UPDATE SELLER ORDER STATUS
====================================================== */
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const seller = await authSeller(userId);
    if (!seller || !seller.storeId) {
      return NextResponse.json(
        { error: "Unauthorized or store not approved" },
        { status: 403 }
      );
    }

    const { storeId } = seller;

    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, storeId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({
      message: "Order status updated successfully",
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}

/* ======================================================
   GET ALL ORDERS FOR SELLER
====================================================== */
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const seller = await authSeller(userId);
    if (!seller || !seller.storeId) {
      return NextResponse.json(
        { error: "Unauthorized or store not approved" },
        { status: 403 }
      );
    }

    const { storeId } = seller;

    const orders = await prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        address: true,
       
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}