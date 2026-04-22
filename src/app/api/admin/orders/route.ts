import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) {
      where.status = status;
    }
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        user: { name: order.user?.name, email: order.user?.email },
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        itemsCount: order.items.length,
        email: order.email,
        phone: order.phone,
      })),
      total,
      pageCount: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("ADMIN_ORDERS_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id, status } = await request.json();

    if (!id || !status) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === "PAID" ? { paidAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("[ADMIN_ORDERS_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
