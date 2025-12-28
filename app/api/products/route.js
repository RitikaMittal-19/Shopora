import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
      include: {
        rating: { // ✅ FIXED (singular)
          select: {
            createdAt: true,
            rating: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        store: true,
      },
    });

    const activeStoreProducts = products.filter(
      (product) => product.store?.isActive
    );

    return NextResponse.json({ products: activeStoreProducts });

  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}