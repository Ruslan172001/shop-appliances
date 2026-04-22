import { Product } from '@/domain/entities/product.entity';

/**
 * Интерфейс репозитория товаров.
 * Определяет контракт для работы с товарами, не зависящий от реализации БД.
 */
export interface IProductRepository {
  findAll(limit?: number, offset?: number): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findByCategory(categoryId: string, limit?: number, offset?: number): Promise<Product[]>;
  findFavorites(ids: string[]): Promise<Product[]>;
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  countByCategory(categoryId: string): Promise<number>;
}
