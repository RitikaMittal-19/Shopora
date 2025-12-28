// app/api/store/product/route.js

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import imagekit from "@/lib/imagekit";

/* =========================================================
   ADD A NEW PRODUCT (SELLER)
========================================================= */
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

    // 🏪 Seller check
    const seller = await authSeller(userId);
    if (!seller || !seller.storeId) {
      return NextResponse.json(
        { error: "Unauthorized or store not approved" },
        { status: 403 }
      );
    }

    const { storeId } = seller;

    // 📦 Form data
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const mrp = Number(formData.get("mrp"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    // ❌ Validation
    if (
      !name ||
      !description ||
      !price ||
      !mrp ||
      !category ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🖼 Upload images to ImageKit
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());

        const upload = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });

        return imagekit.url({
          path: upload.filePath,
          transformation: [
            {
              quality: "auto",
              format: "webp",
              width: "1024",
            },
          ],
        });
      })
    );

    // 🗄 Create product
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        mrp,
        category,
        images: imageUrls,
        storeId, // ✅ string ID
      },
    });

    return NextResponse.json({
      message: "Product added successfully",
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}

/* =========================================================
   GET ALL PRODUCTS FOR SELLER
========================================================= */
export async function GET(request) {
  try {
    // 🔐 Auth
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    const { storeId } = seller;

    // 📦 Fetch products
    const products = await prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });

  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}