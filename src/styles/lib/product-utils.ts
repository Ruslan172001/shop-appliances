/**
 * Рассчитать процент скидки
 * @param oldPrice Старая цена
 * @param price Новая цена
 * @returns Процент скидки (округлённый)
 */
export function calculateDiscountPercent(
  oldPrice: number | null | undefined,
  price: number,
): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * Проверить, есть ли товар в наличии
 * @param quantity Количество на складе
 * @returns true, если в наличии
 */
export function isInStock(quantity: number): boolean {
  return quantity > 0;
}

/**
 * Получить основную картинку товара
 * @param images Массив изображений
 * @returns Основное изображение или первое
 */
export function getMainImage<T extends { isMain: boolean }>(
  images: T[],
): T | undefined {
  return images.find((img) => img.isMain) || images[0];
}
