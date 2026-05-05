import { describe, it, expect } from "vitest";
import {
  calculateDiscountPercent,
  isInStock,
  getMainImage,
} from "./product-utils"; // 👈 уточни путь к модулю

// ============================================
// 📉 Тесты для calculateDiscountPercent
// ============================================
describe("calculateDiscountPercent", () => {
  it("возвращает 0, если oldPrice отсутствует", () => {
    expect(calculateDiscountPercent(null, 100)).toBe(0);
    expect(calculateDiscountPercent(undefined, 100)).toBe(0);
  });

  it("возвращает 0, если oldPrice <= price", () => {
    expect(calculateDiscountPercent(100, 100)).toBe(0); // равные цены
    expect(calculateDiscountPercent(100, 150)).toBe(0); // старая дешевле новой
  });

  it("правильно рассчитывает процент скидки", () => {
    expect(calculateDiscountPercent(1000, 800)).toBe(20);
    expect(calculateDiscountPercent(500, 250)).toBe(50);
    expect(calculateDiscountPercent(2000, 1500)).toBe(25);
  });

  it("корректно округляет дробные значения (Math.round)", () => {
    // 300 -> 200 = 33.33% -> округляется до 33
    expect(calculateDiscountPercent(300, 200)).toBe(33);
    // 100 -> 67 = 33.0% -> 33
    expect(calculateDiscountPercent(100, 67)).toBe(33);
    // 100 -> 66 = 34.0% -> 34
    expect(calculateDiscountPercent(100, 66)).toBe(34);
  });

  it("возвращает 100%, если новая цена равна 0", () => {
    expect(calculateDiscountPercent(100, 0)).toBe(100);
  });
});

// ============================================
// 📦 Тесты для isInStock
// ============================================
describe("isInStock", () => {
  it("возвращает true, если количество > 0", () => {
    expect(isInStock(1)).toBe(true);
    expect(isInStock(100)).toBe(true);
    expect(isInStock(0.5)).toBe(true); // если допускаются дробные остатки
  });

  it("возвращает false, если количество <= 0", () => {
    expect(isInStock(0)).toBe(false);
    expect(isInStock(-1)).toBe(false);
    expect(isInStock(-50)).toBe(false);
  });
});

// ============================================
// 🖼️ Тесты для getMainImage
// ============================================
describe("getMainImage", () => {
  type TestImage = { id: string; url: string; isMain: boolean };

  it("возвращает undefined для пустого массива", () => {
    expect(getMainImage<TestImage>([])).toBeUndefined();
  });

  it("возвращает изображение с isMain: true", () => {
    const images: TestImage[] = [
      { id: "1", url: "/a.jpg", isMain: false },
      { id: "2", url: "/main.jpg", isMain: true },
      { id: "3", url: "/c.jpg", isMain: false },
    ];

    expect(getMainImage(images)).toEqual(images[1]);
  });

  it("возвращает первое изображение, если ни одно не помечено основным", () => {
    const images: TestImage[] = [
      { id: "1", url: "/first.jpg", isMain: false },
      { id: "2", url: "/second.jpg", isMain: false },
    ];

    expect(getMainImage(images)).toEqual(images[0]);
  });

  it("возвращает первое из нескольких основных изображений (поведение Array.find)", () => {
    const images: TestImage[] = [
      { id: "1", url: "/a.jpg", isMain: false },
      { id: "2", url: "/first-main.jpg", isMain: true },
      { id: "3", url: "/second-main.jpg", isMain: true },
    ];

    expect(getMainImage(images)).toEqual(images[1]);
  });

  it("корректно работает с любым типом, имеющим isMain: boolean", () => {
    interface CustomImg {
      isMain: boolean;
      path: string;
      width: number;
    }

    const customImages: CustomImg[] = [
      { isMain: false, path: "/thumb.webp", width: 150 },
      { isMain: true, path: "/hero.webp", width: 1200 },
    ];

    expect(getMainImage(customImages)?.path).toBe("/hero.webp");
  });
});
