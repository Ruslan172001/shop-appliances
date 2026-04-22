import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || undefined;
    const inStock = searchParams.get("inStock") === "true";

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" as const };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (inStock) {
      where.quantity = { gt: 0 };
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
          images: {
            where: { isMain: true },
            select: { url: true },
            take: 1,
          },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);
    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        inStock: p.quantity > 0,
        quantity: p.quantity,
        category: { id: p.category.id, name: p.category.name },
        mainImage: p.images[0]?.url || null,
        reviewCount: p._count.reviews,
        createdAt: p.createdAt,
      })),
      total,
      pageCount: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await req.json();

    // Проверяем, есть ли заказы с этим товаром
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      return NextResponse.json(
        {
          error: "Нельзя удалить товар, который есть в заказах",
          orderItemsCount,
        },
        { status: 400 },
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2003") {
      return NextResponse.json(
        { error: "Нельзя удалить товар — есть связанные заказы" },
        { status: 400 },
      );
    }
    console.error("[ADMIN_PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      categoryId,
      quantity,
      model,
      color,
      country,
      specifications,
      imageUrls,
    } = body;

    // Валидация
    if (!name || !slug || !categoryId || price === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        categoryId,
        quantity: parseInt(quantity) || 0,
        model: model || null,
        color: color || null,
        country: country || null,
        specifications: specifications || {},
        images: imageUrls?.length
          ? {
              create: imageUrls.map((url: string, idx: number) => ({
                url,
                isMain: idx === 0,
                order: idx,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
    });
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
