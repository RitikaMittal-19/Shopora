import { inngest } from "./client";
import prisma from "@/lib/prisma";

/* ================= USER SYNC ================= */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    const email = data.email_addresses?.[0]?.email_address || "";
    const name =
      `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User";
    const image = data.image_url || "";

    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email,
        name,
        image,
      },
      create: {
        id: data.id,
        email,
        name,
        image,
      },
    });
  }
);
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    const email = data.email_addresses?.[0]?.email_address || "";
    const name =
      `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User";
    const image = data.image_url || "";

    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email,
        name,
        image,
      },
      create: {
        id: data.id,
        email,
        name,
        image,
      },
    });
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

/* ================= COUPON EXPIRY ================= */

export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: "app/coupon.expired" },
  async ({ event, step }) => {
    const prisma = await getPrisma();
    const { data } = event;

    const expiryDate = new Date(data.expires_at);

    // Wait until expiry
    await step.sleepUntil("wait-for-expiry", expiryDate);

    // Delete coupon safely
    await step.run("delete-coupon-from-db", async () => {
      await prisma.coupon.delete({
        where: { code: data.code },
      });
    });
  }
);