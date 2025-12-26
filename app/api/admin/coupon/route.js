export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client"; // ✅ REQUIRED

/* ========= CREATE COUPON ========= */
export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { coupon } = await request.json();

    if (
      !coupon ||
      !coupon.code ||
      !coupon.description ||
      typeof coupon.discount !== "number" ||
      Number.isNaN(coupon.discount)
    ) {
      return NextResponse.json(
        { error: "Invalid coupon data" },
        { status: 400 }
      );
    }

    const code = coupon.code.toUpperCase();

    const exists = await prisma.coupon.findUnique({
      where: { code },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    // ✅ Create coupon
    const createdCoupon = await prisma.coupon.create({
      data: {
        ...coupon,
        code,
        expiresAt: coupon.expiresAt
          ? new Date(coupon.expiresAt)
          : null,
      },
    });

    // ✅ Trigger Inngest ONLY if expiry exists
    if (createdCoupon.expiresAt) {
      await inngest.send({
        name: "app/coupon.expired",
        data: {
          code: createdCoupon.code,
          expires_at: createdCoupon.expiresAt,
        },
      });
    }

    return NextResponse.json(
      { message: "Coupon created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

/* ========= DELETE COUPON ========= */
export async function DELETE(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { code },
    });

    return NextResponse.json(
      { message: "Coupon deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    console.error("Delete coupon error:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}

/* ========= GET ALL COUPONS ========= */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons }, { status: 200 });
  } catch (error) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}