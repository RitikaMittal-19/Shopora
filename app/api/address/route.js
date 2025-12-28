// app/api/address/route.js

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/* ================================
   ADD NEW ADDRESS
================================ */
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { address } = await request.json()

const {
  name,
  email,
  phone,
  street,
  city,
  state,
  zip,
  country,
} = address

    if (!name || !email || !phone || !street || !city || !state || !zip || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        name,
        email,
        phone,
        street,
        city,
        state,
        zip,
        country,
      },
    });

    return NextResponse.json({
      message: "Address added successfully",
      address: newAddress,
    });

  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}

/* ================================
   GET USER ADDRESSES
================================ */
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ addresses });

  } catch (error) {
    console.error("Fetch address error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}