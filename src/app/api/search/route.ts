import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);

    if (!query.trim()) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          category: true,
          images: {
            where: { isMain: true },
            orderBy: { order: "asc" },
            take: 1,
          },
        },
        take: limit,
        orderBy: { rating: "desc" },
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Не удалось выполнить поиск" },
      { status: 500 },
    );
  }
}
