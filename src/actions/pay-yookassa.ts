"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface YooKassaResponse {
  id: string;
  status: string;
  confirmation: {
    confirmation_url: string;
  };
}

export async function createYooKassaPayment(
  orderId: string,
): Promise<{ error?: string; confirmationUrl?: string }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { error: "Заказ не найден" };
  }

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!shopId || !secretKey) {
    return { error: "YooKassa не настроен" };
  }
  const returnUrl = `${appUrl}/order/${orderId}`;

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Idempotence-Key": orderId,
      },
      body: JSON.stringify({
        amount: {
          value: Number(order.total).toFixed(2),
          currency: "RUB",
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: returnUrl,
        },
        description: `Заказ #${order.id.slice(-8).toUpperCase()}`,
        metadata: { order_id: orderId },
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.description || "Ошибка создания платежа" };
    }
    const payment: YooKassaResponse = await response.json();

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: payment.id },
    });
    return { confirmationUrl: payment.confirmation.confirmation_url };
  } catch (error) {
    console.error("YooKassa error", error);
    return { error: "Не удалось создать платеж" };
  }
}
