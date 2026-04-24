import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { z } from "zod";

// 🔒 Схема только тех полей, которые нужны на главной
export const homepagePromoSchema = z.object({
  code: z.string(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number(),
  validUntil: z.string().datetime(),
  description: z.string().nullable(),
  minOrderAmount: z.number(),
});

export type HomepagePromo = z.infer<typeof homepagePromoSchema>;

export const getHomepagePromo = unstable_cache(
  async (): Promise<HomepagePromo | null> => {
    const now = new Date();

    const promo = await prisma.promoCode.findFirst({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      orderBy: { validUntil: "asc" },
      select: {
        code: true,
        type: true,
        value: true,
        validUntil: true,
        description: true,
        minOrderAmount: true,
        usageLimit: true,
        usageCount: true,
      },
    });

    if (!promo) return null;
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit)
      return null;

    return homepagePromoSchema.parse({
      code: promo.code,
      type: promo.type,
      value: Number(promo.value),
      validUntil: promo.validUntil.toISOString(),
      description: promo.description,
      minOrderAmount: Number(promo.minOrderAmount),
    });
  },
  ["homepage-promo"],
  { revalidate: 300 },
);
