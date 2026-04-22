import { Category } from '@/domain/entities/category.entity';

/**
 * Интерфейс репозитория категорий.
 * Определяет контракт для работы с категориями, не зависящий от реализации БД.
 */
export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findRootCategories(): Promise<Category[]>;
  findWithChildren(id: string): Promise<Category | null>;
  create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(id: string, data: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
  countProductsInCategory(categoryId: string): Promise<number>;
}
