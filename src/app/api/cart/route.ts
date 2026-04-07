import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ICartItem } from "@/types";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
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

    const items: ICartItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      oldPrice: item.product.oldPrice
        ? Number(item.product.oldPrice)
        : undefined,
      image: item.product.images[0]?.url || "",
      quantity: item.quantity,
      inStock: item.product.quantity > 0,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить корзину" },
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
    const { productId, quantity = 1 } = body;
    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { error: "Количество должно быть больше 0" },
        { status: 400 },
      );
    }
    if (!productId) {
      return NextResponse.json({ error: "Товар не указан" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Не удалось добавить в корзину" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ error: "Товар не указан" }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      });
      return NextResponse.json({ success: true });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Не удалось обновить корзину" },
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
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
      });
    } else {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Не удалось удалить из корзины" },
      { status: 500 },
    );
  }
}
