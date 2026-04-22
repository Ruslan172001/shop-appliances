import { IProductBase } from '@/types/product.interface';

/**
 * Доменная сущность Товара.
 * Инкапсулирует бизнес-логику продукта.
 */
export class Product implements IProductBase {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  categoryId: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IProductBase) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.price = data.price;
    this.oldPrice = data.oldPrice;
    this.categoryId = data.categoryId;
    this.images = data.images;
    this.rating = data.rating;
    this.reviewCount = data.reviewCount;
    this.isFavorite = data.isFavorite;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Бизнес-правило: есть ли скидка на товар?
   */
  hasDiscount(): boolean {
    return !!this.oldPrice && this.oldPrice > this.price;
  }

  /**
   * Бизнес-правило: расчет процента скидки.
   */
  getDiscountPercent(): number {
    if (!this.hasDiscount()) return 0;
    return Math.round(((this.oldPrice! - this.price) / this.oldPrice!) * 100);
  }

  /**
   * Бизнес-правило: доступен ли товар для покупки?
   * (Здесь можно добавить проверку остатков, если будет поле stock)
   */
  isAvailable(): boolean {
    return this.price > 0;
  }
}
