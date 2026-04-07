import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHmac } from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  if (!secretKey) return false;

  const hmac = createHmac("sha256", secretKey);
  const calculatedSignature = hmac.update(payload).digest("hex");

  return calculatedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("HTTP_X_YOOKASSA_SIGNATURE");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 401 },
      );
    }

    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body).event;
    const payment = JSON.parse(body).object;

    if (event !== "payment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const orderId = payment.metadata?.order_id;

    if (!orderId) {
      return NextResponse.json(
        { error: "order_id not found in metadata" },
        { status: 400 },
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paymentId: payment.id,
        paidAt: new Date(payment.paid_at || payment.created_at),
      },
    });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (order) {
      await prisma.cartItem.deleteMany({
        where: { userId: order.userId },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("YooKassa webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
