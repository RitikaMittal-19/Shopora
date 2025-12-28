export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/* ================= UPDATE CART ================= */
export async function POST(request) {
  const { userId, sessionClaims } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { cart } = await request.json();

  // ✅ Get user info from session (NO clerkClient)
  const name =
    sessionClaims?.name ||
    sessionClaims?.username ||
    "User";

  const email =
    sessionClaims?.email ||
    sessionClaims?.email_addresses?.[0]?.email_address ||
    "no-email@clerk.dev";

  const image =
    sessionClaims?.picture ||
    "";

  await prisma.user.upsert({
    where: { id: userId },
    update: { cart },
    create: {
      id: userId,
      name,
      email,
      image,
      cart,
    },
  });

  return NextResponse.json({ message: "Cart updated successfully" });
}

/* ================= GET CART ================= */
export async function GET(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cart: true },
  });

  return NextResponse.json({
    cart: user?.cart || {},
  });
}