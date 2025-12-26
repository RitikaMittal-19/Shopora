import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { isAdmin: false },
        { status: 401 }
      );
    }

    const isAdmin = await authAdmin(user.id);

    if (!isAdmin) {
      return NextResponse.json(
        { isAdmin: false },
        { status: 403 }
      );
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error("Error in is-admin route:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}