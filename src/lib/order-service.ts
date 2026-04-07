import prisma from "@/lib/prisma";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: unknown;
    quantity: number;
    images: Array<{ url: string }>;
  };
}

/**
 * Проверить наличие товаров в корзине
 */
export function checkCartItems(cartItems: CartItemWithProduct[]): {
  error?: string;
} {
  for (const item of cartItems) {
    if (item.product.quantity < item.quantity) {
      return {
        error: `"${item.product.name}" — доступно только ${item.product.quantity} шт.`,
      };
    }
  }
  return {};
}

/**
 * Посчитать общую сумму корзины
 */
export function calculateCartTotal(cartItems: CartItemWithProduct[]): number {
  return cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
}

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * Создать заказ из корзины в транзакции
 */
export async function createOrderFromCart(
  tx: Tx,
  userId: string,
  cartItems: CartItemWithProduct[],
  total: number,
  address: string,
  phone: string,
  email: string,
) {
  const order = await tx.order.create({
    data: {
      userId,
      total,
      address,
      phone,
      email,
    },
  });

  for (const item of cartItems) {
    await tx.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        image: item.product.images[0]?.url || null,
      },
    });

    await tx.product.update({
      where: { id: item.product.id },
      data: { quantity: { decrement: item.quantity } },
    });
  }

  await tx.cartItem.deleteMany({ where: { userId } });

  return order;
}

/**
 * Загрузить корзину пользователя
 */
export async function loadUserCart(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          images: {
            where: { isMain: true },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });
}

export async function applyPromoCode(
  code: string,
  cartTotal: number,
): Promise<{ error?: string; discount?: number; finalAmount?: number }> {
  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!promo) return { error: "Промокод не найден" };
  if (!promo.isActive) return { error: "Промокод не активен" };

  const now = new Date();

  if (now < promo.validFrom || now > promo.validUntil) {
    return { error: "Промокод истек" };
  }

  if (cartTotal < Number(promo.minOrderAmount)) {
    return {
      error: `Минимальная сумма заказа ${Number(promo.minOrderAmount).toLocaleString()} ₽`,
    };
  }
  if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
    return { error: "Промокод исчерпан" };
  }

  let discount = 0;
  if (promo.type === "PERCENT") {
    discount = Math.round(cartTotal * (Number(promo.value) / 100));
    if (promo.maxDiscountAmount) {
      discount = Math.min(discount, Number(promo.maxDiscountAmount));
    }
  } else {
    discount = Number(promo.value);
  }

  discount = Math.min(discount, cartTotal);

  return { discount, finalAmount: cartTotal - discount };
}
