import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import * as z from "zod";

const productsQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.enum(["true", "false"]).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  brands: z.array(z.string()).optional(),
  sort: z
    .enum(["price", "rating", "name", "createdAt", "reviewCount"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const parsed = productsQuerySchema.safeParse({
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      inStock: searchParams.get("inStock") || undefined,
      rating: searchParams.get("rating") || undefined,
      brands:
        searchParams.getAll("brands").length > 0
          ? searchParams.getAll("brands")
          : undefined,
      sort: searchParams.get("sort") || undefined,
      order: searchParams.get("order") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Некорректные параметры запроса",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      rating,
      brands,
      sort,
      order,
      page,
      limit,
    } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (inStock === "true") {
      where.quantity = { gt: 0 };
    }

    if (rating !== undefined) {
      where.rating = { gte: rating };
    }

    if (brands && brands.length > 0) {
      where.model = { in: brands };
    }
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        { model: { contains: searchQuery, mode: "insensitive" } },
      ];
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            where: { isMain: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить товары" },
      { status: 500 },
    );
  }
}
