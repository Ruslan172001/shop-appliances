"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validators/order.schema";
import { createYooKassaPayment } from "./pay-yookassa";
import {
  checkCartItems,
  calculateCartTotal,
  createOrderFromCart,
  loadUserCart,
} from "@/lib/order-service";
import { Prisma } from "@/app/generated/prisma/client";

export interface OrderFormState {
  error?: string;
  orderId?: string;
  confirmationUrl?: string;
  paymentMethod?: string;
  discount?: number;
}

export async function createOrder(
  prevState: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const userId = formData.get("userId") as string;
  if (!userId) {
    return { error: "Необходима авторизация" };
  }

  const result = checkoutSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    city: formData.get("city"),
    address: formData.get("address"),
    comment: formData.get("comment"),
    paymentMethod: formData.get("paymentMethod"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return { error: firstError || "Ошибка валидации" };
  }

  const data = result.data;
  const promoCode = (formData.get("promoCode") as string) || "";

  const cartItems = await loadUserCart(userId);

  if (cartItems.length === 0) {
    return { error: "Корзина пуста" };
  }

  const stockError = checkCartItems(cartItems);
  if (stockError.error) {
    return { error: stockError.error };
  }

  const subtotal = calculateCartTotal(cartItems);

  // Предварительный расчёт скидки (без строгой проверки лимита)
  let discount = 0;
  if (promoCode) {
    const promo = await prisma.promoCode.findUnique({
      where: { code: promoCode },
    });

    if (promo && promo.isActive) {
      const now = new Date();
      if (now >= promo.validFrom && now <= promo.validUntil) {
        if (subtotal >= Number(promo.minOrderAmount)) {
          let calculatedDiscount = 0;
          if (promo.type === "PERCENT") {
            calculatedDiscount = Math.round(
              subtotal * (Number(promo.value) / 100),
            );
            if (promo.maxDiscountAmount) {
              calculatedDiscount = Math.min(
                calculatedDiscount,
                Number(promo.maxDiscountAmount),
              );
            }
          } else {
            calculatedDiscount = Number(promo.value);
          }
          discount = Math.min(calculatedDiscount, subtotal);
        }
      }
    }
  }

  const total = subtotal - discount;

  try {
    const order = await prisma.$transaction(
      async (tx) => {
        // Строгая проверка лимита ВНУТРИ транзакции
        if (promoCode && discount > 0) {
          const promo = await tx.promoCode.findUnique({
            where: { code: promoCode },
          });

          if (!promo) {
            throw new Error("Промокод не найден");
          }

          if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
            throw new Error("Лимит использования промокода исчерпан");
          }
        }

        const newOrder = await createOrderFromCart(
          tx,
          userId,
          cartItems,
          total,
          `${data.city}, ${data.address}`,
          data.phone,
          data.email,
        );

        // Атомарное увеличение счётчика
        if (promoCode && discount > 0) {
          await tx.promoCode.update({
            where: { code: promoCode },
            data: { usageCount: { increment: 1 } },
          });
        }

        return newOrder;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    if (data.paymentMethod === "online") {
      const paymentResult = await createYooKassaPayment(order.id);
      if (paymentResult.error) {
        return { error: paymentResult.error };
      }
      return {
        orderId: order.id,
        confirmationUrl: paymentResult.confirmationUrl,
        paymentMethod: "online",
        discount,
      };
    }

    revalidatePath("/profile");

    return {
      orderId: order.id,
      paymentMethod: data.paymentMethod,
      discount,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ошибка при создании заказа" };
  }
}
