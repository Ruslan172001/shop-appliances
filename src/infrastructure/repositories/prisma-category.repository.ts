import { PrismaClient, Category as PrismaCategory } from '@prisma/client';
import { Category } from '@/domain/entities/category.entity';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';

/**
 * Реализация репозитория категорий для Prisma.
 * Infrastructure слой - зависит от конкретной БД.
 */
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map((cat) => this.toDomain(cat));
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    return category ? this.toDomain(category) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    return category ? this.toDomain(category) : null;
  }

  async findRootCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });
    return categories.map((cat) => this.toDomain(cat));
  }

  async findWithChildren(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });
    
    if (!category) return null;

    const domainCategory = this.toDomain(category);
    
    if (category.children) {
      domainCategory.children = category.children.map((child) => this.toDomain(child));
    }

    return domainCategory;
  }

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const category = await this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
      },
    });
    return this.toDomain(category);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
      },
    });
    return this.toDomain(category);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async countProductsInCategory(categoryId: string): Promise<number> {
    const count = await this.prisma.product.count({
      where: { categoryId },
    });
    return count;
  }

  /**
   * Маппинг из Prisma модели в доменную сущность.
   * Изолирует зависимость от Prisma.
   */
  private toDomain(prismaCategory: PrismaCategory): Category {
    return new Category({
      id: prismaCategory.id,
      name: prismaCategory.name,
      slug: prismaCategory.slug,
      description: prismaCategory.description,
      parentId: prismaCategory.parentId,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
    });
  }
}
