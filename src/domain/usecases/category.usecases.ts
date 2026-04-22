import { Category } from '@/domain/entities/category.entity';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';

/**
 * Use Case: Получение списка категорий с подсчетом товаров.
 * Инкапсулирует бизнес-логику получения категорий.
 */
export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();

    // Обогащаем категории количеством товаров (бизнес-логика)
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await this.categoryRepository.countProductsInCategory(category.id);
        // Создаем новую инстанцию сущности с обновленными данными
        return new Category({
          ...category,
          productCount: count,
        });
      })
    );

    return categoriesWithCounts;
  }
}

/**
 * Use Case: Получение категории по ID.
 */
export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      return null;
    }

    const count = await this.categoryRepository.countProductsInCategory(id);
    
    return new Category({
      ...category,
      productCount: count,
    });
  }
}

/**
 * Use Case: Удаление категории.
 * Включает проверку бизнес-правил перед удалением.
 */
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      return { success: false, error: 'Категория не найдена' };
    }

    // Проверка бизнес-правила через метод сущности
    if (!category.canBeDeleted()) {
      return { 
        success: false, 
        error: 'Невозможно удалить категорию: в ней есть товары или дочерние категории' 
      };
    }

    await this.categoryRepository.delete(id);
    return { success: true };
  }
}
