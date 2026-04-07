import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
            category: true,
          },
        },
      },
    });
    const items = wishlistItems.map((item) => ({
      id: `${item.userId}-${item.productId}`,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      oldPrice: item.product.oldPrice
        ? Number(item.product.oldPrice)
        : undefined,
      image: item.product.images[0]?.url || "",
      inStock: item.product.quantity > 0,
    }));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Ошибка при получении списка желаемого:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить список желаемого" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 },
      );
    }
    const body = await request.json();
    const { productId } = body;

    const wishlistItem = await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        productId,
      },
    });
    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error("Ошибка при добавлении в список желаемого:", error);
    return NextResponse.json(
      { error: "Не удалось добавить в список желаемого" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 },
      );
    }
    const body = await request.json();
    const { productId } = body;
    if (productId) {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      });
    } else {
      await prisma.wishlist.deleteMany({
        where: { userId: session.user.id },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении из списка желаемого:", error);
    return NextResponse.json(
      { error: "Не удалось удалить из списка желаемого" },
      { status: 500 },
    );
  }
}
