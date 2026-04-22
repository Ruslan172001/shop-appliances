import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    const { name, slug, description, parentId } = await request.json();

    if (!name || !slug) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return new NextResponse("slug already exists", { status: 400 });
    }
    if (parentId === id) {
      return new NextResponse("Cannot set parent to self", { status: 400 });
    }
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
      },
    });
    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
  } catch (error) {
    console.error("[ADMIN_CATEGORY_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await params;
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      return new NextResponse("Невозможно удалить категорию с продуктами", {
        status: 400,
      });
    }
    const childrenCount = await prisma.category.count({
      where: { parentId: id },
    });
    if (childrenCount > 0) {
      return new NextResponse("Невозможно удалить категорию с подкатегориями", {
        status: 400,
      });
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
