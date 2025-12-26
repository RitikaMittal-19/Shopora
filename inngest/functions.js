import { inngest } from "./client";

let prismaClient;

async function getPrisma() {
  if (!prismaClient) {
    const { PrismaClient } = await import("@prisma/client");
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

/* ================= USER SYNC ================= */

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const prisma = await getPrisma();
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url || null,
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

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url || null,
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