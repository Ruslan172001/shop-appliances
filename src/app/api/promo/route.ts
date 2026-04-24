import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code || !cartTotal) {
      return NextResponse.json(
        { error: "Укажите промокод и сумму заказа" },
        { status: 400 },
      );
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return NextResponse.json(
        { error: "Промокод не найден" },
        { status: 404 },
      );
    }
    if (!promo.isActive) {
      return NextResponse.json(
        { error: "Промокод не активен" },
        { status: 400 },
      );
    }
    if (cartTotal < Number(promo.minOrderAmount)) {
      return NextResponse.json(
        {
          error: `Минимальная сумма заказа: ${Number(promo.minOrderAmount).toLocaleString()} ₽`,
        },
        { status: 400 },
      );
    }
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ error: "Промокод исчерпан" }, { status: 400 });
    }
    let discount = 0;
    if (promo.type === "PERCENT") {
      discount = Math.round(cartTotal * (Number(promo.value) / 100));
      if (promo.maxDiscountAmount) {
        discount = Math.min(discount, Number(promo.maxDiscountAmount));
      }
    } else {
      discount = Number(promo.value);
    }
    discount = Math.min(discount, cartTotal);

    return NextResponse.json({
      code: promo.code,
      type: promo.type,
      value: Number(promo.value),
      discount,
      finalAmount: cartTotal - discount,
    });
  } catch (error) {
    console.error("Promo code error:", error);
    return NextResponse.json(
      { error: "Не удалось проверить промокод" },
      { status: 500 },
    );
  }
}
