import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — получить один товар для редактирования
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
      },
    });

    if (!product) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      categoryId: product.categoryId,
      quantity: product.quantity,
      model: product.model || null,
      color: product.color || null,
      country: product.country || null,
      specifications: product.specifications || {},
      images: product.images.map((img) => img.url),
    });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT — обновить товар
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
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
    } = body;

    // Валидация
    if (!name || !slug || !categoryId || price === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
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
      },
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
    });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE — удалить товар (по id из body)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
