import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: {
        children: {
          orderBy: { name: "asc" },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        productCount: category._count.products,
        children: category.children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          description: child.description,
          parentId: child.parentId,
          productCount: child._count.products,
        })),
      })),
    });
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_GET]", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { name, slug, description, parentId } = await request.json();

    if (!name || !slug) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { slug } });

    if (existing) {
      return new NextResponse("Category already exists", { status: 400 });
    }
    const category = await prisma.category.create({
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
    console.error("[ADMIN_CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
