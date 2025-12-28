import prisma from "@/lib/prisma";

const authSeller = async (userId) => {
  try {
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
    });

    if (!user || !user.store) return null;

    if (user.store.status !== "approved") return null;

    // ✅ RETURN OBJECT (not string)
    return {
      storeId: user.store.id,
    };

  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

export default authSeller;