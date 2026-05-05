import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import prisma from "@/lib/prisma";
import {
  applyPromoCode,
  calculateCartTotal,
  CartItemWithProduct,
  checkCartItems,
  createOrderFromCart,
  loadUserCart,
} from "./order-service";

// Мокаем prisma клиент
vi.mock("@/lib/prisma", () => ({
  default: {
    cartItem: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    product: {
      update: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
    orderItem: {
      create: vi.fn(),
    },
    promoCode: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// ============================================
// 🧪 Тесты для checkCartItems (чистая функция)
// ============================================
describe("checkCartItems", () => {
  it("возвращает пустой объект, если все товары доступны", () => {
    const cartItems: CartItemWithProduct[] = [
      {
        productId: "1",
        quantity: 2,
        product: {
          id: "1",
          name: "Товар 1",
          price: 1000,
          quantity: 5,
          images: [{ url: "/img1.jpg" }],
        },
      },
    ];

    const result = checkCartItems(cartItems);
    expect(result).toEqual({});
  });

  it("возвращает ошибку, если товара недостаточно", () => {
    const cartItems: CartItemWithProduct[] = [
      {
        productId: "1",
        quantity: 10,
        product: {
          id: "1",
          name: "Товар 1",
          price: 1000,
          quantity: 3,
          images: [{ url: "/img1.jpg" }],
        },
      },
    ];

    const result = checkCartItems(cartItems);
    expect(result.error).toBe('"Товар 1" — доступно только 3 шт.');
  });

  it("проверяет все товары и возвращает ошибку первого недоступного", () => {
    const cartItems: CartItemWithProduct[] = [
      {
        productId: "1",
        quantity: 1,
        product: {
          id: "1",
          name: "Товар 1",
          price: 1000,
          quantity: 5,
          images: [{ url: "/img1.jpg" }],
        },
      },
      {
        productId: "2",
        quantity: 3,
        product: {
          id: "2",
          name: "Товар 2",
          price: 2000,
          quantity: 2,
          images: [{ url: "/img2.jpg" }],
        },
      },
    ];

    const result = checkCartItems(cartItems);
    expect(result.error).toBe('"Товар 2" — доступно только 2 шт.');
  });

  it("возвращает пустой объект для пустой корзины", () => {
    expect(checkCartItems([])).toEqual({});
  });
});

// ============================================
// 🧮 Тесты для calculateCartTotal (чистая функция)
// ============================================
describe("calculateCartTotal", () => {
  it("возвращает 0 для пустой корзины", () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it("правильно считает сумму для одного товара", () => {
    const cartItems: CartItemWithProduct[] = [
      {
        productId: "1",
        quantity: 3,
        product: {
          id: "1",
          name: "Товар 1",
          price: 1500,
          quantity: 10,
          images: [{ url: "/img1.jpg" }],
        },
      },
    ];

    expect(calculateCartTotal(cartItems)).toBe(4500);
  });

  it("правильно считает сумму для нескольких товаров", () => {
    const cartItems: CartItemWithProduct[] = [
      {
        productId: "1",
        quantity: 2,
        product: {
          id: "1",
          name: "Товар 1",
          price: 1000,
          quantity: 10,
          images: [{ url: "/img1.jpg" }],
        },
      },
      {
        productId: "2",
        quantity: 1,
        product: {
          id: "2",
          name: "Товар 2",
          price: 2500.5,
          quantity: 5,
          images: [{ url: "/img2.jpg" }],
        },
      },
    ];

    expect(calculateCartTotal(cartItems)).toBe(4500.5);
  });

  it("корректно обрабатывает price как строку", () => {
    const cartItems: CartItemWithProduct[] = [
      {
        productId: "1",
        quantity: 2,
        product: {
          id: "1",
          name: "Товар 1",
          price: "1500",
          quantity: 10,
          images: [{ url: "/img1.jpg" }],
        },
      },
    ];

    expect(calculateCartTotal(cartItems)).toBe(3000);
  });
});

// ============================================
// 🛒 Тесты для loadUserCart (async, Prisma)
// ============================================
describe("loadUserCart", () => {
  const mockPrisma = prisma as unknown as {
    cartItem: { findMany: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("загружает корзину пользователя с продуктами", async () => {
    const mockCartItems = [
      {
        productId: "1",
        quantity: 2,
        product: {
          id: "1",
          name: "Товар 1",
          price: 1000,
          quantity: 10,
          images: [{ url: "/main.jpg" }],
        },
      },
    ];

    mockPrisma.cartItem.findMany.mockResolvedValue(mockCartItems);

    const result = await loadUserCart("user-123");

    expect(mockPrisma.cartItem.findMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
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
    expect(result).toEqual(mockCartItems);
  });

  it("возвращает пустой массив, если корзина пуста", async () => {
    mockPrisma.cartItem.findMany.mockResolvedValue([]);

    const result = await loadUserCart("user-123");
    expect(result).toEqual([]);
  });
});

// ============================================
// 🎁 Тесты для applyPromoCode (async, сложная логика)
// ============================================
describe("applyPromoCode", () => {
  const mockPrisma = prisma as unknown as {
    promoCode: { findUnique: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("возвращает ошибку, если промокод не найден", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue(null);

    const result = await applyPromoCode("INVALID", 1000);
    expect(result).toEqual({ error: "Промокод не найден" });
  });

  it("возвращает ошибку, если промокод не активен", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "SALE20",
      isActive: false,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
    });

    const result = await applyPromoCode("SALE20", 1000);
    expect(result).toEqual({ error: "Промокод не активен" });
  });

  it("возвращает ошибку, если промокод ещё не начал действовать", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "FUTURE",
      isActive: true,
      validFrom: new Date("2024-07-01"),
      validUntil: new Date("2024-12-31"),
    });

    const result = await applyPromoCode("FUTURE", 1000);
    expect(result).toEqual({ error: "Промокод истек" });
  });

  it("возвращает ошибку, если промокод истёк", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "EXPIRED",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-06-01"),
    });

    const result = await applyPromoCode("EXPIRED", 1000);
    expect(result).toEqual({ error: "Промокод истек" });
  });

  it("возвращает ошибку, если сумма заказа меньше минимальной", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "MIN1000",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 1500,
    });

    const result = await applyPromoCode("MIN1000", 1000);
    expect(result).toEqual({
      error: "Минимальная сумма заказа 1\u00A0500 ₽",
    });
  });

  it("возвращает ошибку, если лимит использований исчерпан", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "LIMITED",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 0,
      usageLimit: 10,
      usageCount: 10,
    });

    const result = await applyPromoCode("LIMITED", 2000);
    expect(result).toEqual({ error: "Промокод исчерпан" });
  });

  it("применяет процентную скидку", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "PERCENT10",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 0,
      type: "PERCENT",
      value: 10,
      usageLimit: 0,
    });

    const result = await applyPromoCode("PERCENT10", 1000);
    expect(result).toEqual({
      discount: 100,
      finalAmount: 900,
    });
  });

  it("применяет процентную скидку с ограничением максимума", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "PERCENT50",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 0,
      type: "PERCENT",
      value: 50,
      maxDiscountAmount: 200,
      usageLimit: 0,
    });

    const result = await applyPromoCode("PERCENT50", 1000);
    expect(result).toEqual({
      discount: 200, // не 500, потому что есть лимит
      finalAmount: 800,
    });
  });

  it("применяет фиксированную скидку", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "FIXED300",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 0,
      type: "FIXED",
      value: 300,
      usageLimit: 0,
    });

    const result = await applyPromoCode("FIXED300", 1000);
    expect(result).toEqual({
      discount: 300,
      finalAmount: 700,
    });
  });

  it("не применяет скидку больше суммы заказа", async () => {
    mockPrisma.promoCode.findUnique.mockResolvedValue({
      code: "BIG500",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 0,
      type: "FIXED",
      value: 500,
      usageLimit: 0,
    });

    const result = await applyPromoCode("BIG500", 300);
    expect(result).toEqual({
      discount: 300, // скидка обрезана до суммы заказа
      finalAmount: 0,
    });
  });

  it("игнорирует регистр промокода", async () => {
    const mockPromo = {
      code: "SUMMER2024",
      isActive: true,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      minOrderAmount: 0,
      type: "PERCENT",
      value: 15,
      usageLimit: 0,
    };

    mockPrisma.promoCode.findUnique.mockResolvedValue(mockPromo);

    await applyPromoCode("summer2024", 1000);

    expect(mockPrisma.promoCode.findUnique).toHaveBeenCalledWith({
      where: { code: "SUMMER2024" },
    });
  });
});

// ============================================
// 📦 Тесты для createOrderFromCart (async, транзакция)
// ============================================
describe("createOrderFromCart", () => {
  const mockTx = {
    order: { create: vi.fn() },
    orderItem: { create: vi.fn() },
    product: { update: vi.fn() },
    cartItem: { deleteMany: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("создаёт заказ, элементы заказа, обновляет товары и очищает корзину", async () => {
    const mockOrder = { id: "order-1", userId: "user-123", total: 3000 };
    mockTx.order.create.mockResolvedValue(mockOrder);

    const cartItems: CartItemWithProduct[] = [
      {
        productId: "prod-1",
        quantity: 2,
        product: {
          id: "prod-1",
          name: "Товар 1",
          price: 1000,
          quantity: 10,
          images: [{ url: "/img1.jpg" }],
        },
      },
      {
        productId: "prod-2",
        quantity: 1,
        product: {
          id: "prod-2",
          name: "Товар 2",
          price: 1000,
          quantity: 5,
          images: [], // нет изображений
        },
      },
    ];

    const result = await createOrderFromCart(
      mockTx as any,
      "user-123",
      cartItems,
      3000,
      "г. Москва, ул. Примерная, 1",
      "+79991234567",
      "user@example.com",
    );

    // Проверяем создание заказа
    expect(mockTx.order.create).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        total: 3000,
        address: "г. Москва, ул. Примерная, 1",
        phone: "+79991234567",
        email: "user@example.com",
      },
    });

    // Проверяем создание элементов заказа
    expect(mockTx.orderItem.create).toHaveBeenCalledTimes(2);
    expect(mockTx.orderItem.create).toHaveBeenNthCalledWith(1, {
      data: {
        orderId: "order-1",
        productId: "prod-1",
        name: "Товар 1",
        price: 1000,
        quantity: 2,
        image: "/img1.jpg",
      },
    });
    expect(mockTx.orderItem.create).toHaveBeenNthCalledWith(2, {
      data: {
        orderId: "order-1",
        productId: "prod-2",
        name: "Товар 2",
        price: 1000,
        quantity: 1,
        image: null, // нет изображений
      },
    });

    // Проверяем обновление остатков товаров
    expect(mockTx.product.update).toHaveBeenCalledTimes(2);
    expect(mockTx.product.update).toHaveBeenCalledWith({
      where: { id: "prod-1" },
      data: { quantity: { decrement: 2 } },
    });
    expect(mockTx.product.update).toHaveBeenCalledWith({
      where: { id: "prod-2" },
      data: { quantity: { decrement: 1 } },
    });

    // Проверяем очистку корзины
    expect(mockTx.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
    });

    // Проверяем возврат заказа
    expect(result).toEqual(mockOrder);
  });

  it("корректно обрабатывает price как строку", async () => {
    const mockOrder = { id: "order-2", userId: "user-123", total: 2000 };
    mockTx.order.create.mockResolvedValue(mockOrder);

    const cartItems: CartItemWithProduct[] = [
      {
        productId: "prod-1",
        quantity: 2,
        product: {
          id: "prod-1",
          name: "Товар 1",
          price: "1000", // строка
          quantity: 10,
          images: [{ url: "/img1.jpg" }],
        },
      },
    ];

    await createOrderFromCart(
      mockTx as any,
      "user-123",
      cartItems,
      2000,
      "Адрес",
      "Телефон",
      "email@test.com",
    );

    expect(mockTx.orderItem.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        price: 1000, // преобразовано в число
        quantity: 2,
      }),
    });
  });
});
