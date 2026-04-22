import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [
      totalProducts,
      totalOrders,
      totalReviews,
      revenue,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.review.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          items: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        _count: true,
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    // Получаем детали топ-товаров и считаем выручку
    const topProductIds = topProducts.map((p) => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, slug: true, price: true },
    });

    const topProductMapped = topProducts
      .map((tp) => {
        const details = topProductDetails.find((p) => p.id === tp.productId);
        const price = details?.price ? Number(details.price) : 0;
        const quantity = tp._sum.quantity || 0;
        return {
          id: tp.productId,
          name: details?.name || "Unknown",
          slug: details?.slug || "",
          sales: quantity,
          revenue: price * quantity,
        };
      })
      .sort((a, b) => b.sales - a.sales);

    // Конвертируем Decimal в число
    const totalRevenue = revenue._sum.total ? Number(revenue._sum.total) : 0;

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalReviews,
      revenue: totalRevenue,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        user: { name: order.user?.name },
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
      })),
      topProducts: topProductMapped,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
