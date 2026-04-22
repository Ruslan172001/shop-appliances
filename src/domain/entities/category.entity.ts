import { ICategoryBase } from '@/types/product.interface';

/**
 * Доменная сущность Категории.
 * Не зависит от структуры таблиц БД и фреймворков.
 */
export class Category implements ICategoryBase {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  productCount?: number;
  children?: Category[];

  constructor(data: ICategoryBase) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.parentId = data.parentId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.productCount = data.productCount;
    this.children = data.children;
  }

  /**
   * Бизнес-правило: можно ли удалить категорию?
   * Категория не может быть удалена, если в ней есть товары или дочерние категории.
   */
  canBeDeleted(): boolean {
    return (this.productCount ?? 0) === 0 && (this.children?.length ?? 0) === 0;
  }

  /**
   * Бизнес-правило: является ли категория корневой?
   */
  isRoot(): boolean {
    return !this.parentId;
  }
}
