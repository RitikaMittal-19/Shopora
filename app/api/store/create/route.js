export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/* ===================== POST ===================== */
export async function POST(req) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = clerkUser.id;

    // ✅ Sync Clerk user → Prisma
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: clerkUser.fullName || "Unknown",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
      },
      create: {
        id: userId,
        name: clerkUser.fullName || "Unknown",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
      },
    });

    const {
      name,
      username,
      description,
      email,
      contact,
      address,
      logo,
    } = await req.json();

    if (!name || !username || !description || !email || !contact || !address || !logo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ One store per user
    const existingStore = await prisma.store.findFirst({
      where: { userId },
    });

    if (existingStore) {
      return NextResponse.json(
        { status: existingStore.status },
        { status: 200 }
      );
    }

    // ✅ Username uniqueness
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        username: username.toLowerCase(),
        description,
        email,
        contact,
        address,
        logo,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Applied, waiting for approval",
        storeId: newStore.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ===================== GET ===================== */
export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const store = await prisma.store.findFirst({
      where: { userId: user.id },
      select: { status: true },
    });

    return NextResponse.json({
      status: store?.status || null,
    });
  } catch (error) {
    console.error("Fetch store status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch store status" },
      { status: 500 }
    );
  }
}