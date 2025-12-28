// toggle stock status of a product

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function POST(request) {
  try {
    // 🔐 Auth
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 🏪 Seller check
    const seller = await authSeller(userId);
    if (!seller || !seller.storeId) {
      return NextResponse.json(
        { error: "Unauthorized or store not approved" },
        { status: 403 }
      );
    }

    const { storeId } = seller; // ✅ FIX

    // 🔍 Find product (ownership check)
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: storeId, // ✅ string
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 🔄 Toggle stock
    await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });

    return NextResponse.json({
      message: "Product stock status updated",
    });

  } catch (error) {
    console.error("Error stock toggling:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}