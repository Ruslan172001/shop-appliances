import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { OrderStatus } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }
    return NextResponse.json({
      id: order.id,
      user: { name: order.user?.name, email: order.user?.email },
      email: order.email,
      phone: order.phone,
      adress: order.address,
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      comment: null,
      paymentMethod: null,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || "Unknown",
        price: Number(item.price),
        quantity: item.quantity,
        image: null,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_ORDER_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const validStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        ...(status === "PAID" ? { paidAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("[ADMIN_ORDER_OUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
