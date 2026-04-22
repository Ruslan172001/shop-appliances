import { PrismaClient } from '@prisma/client';
import { PrismaCategoryRepository } from '@/infrastructure/repositories/prisma-category.repository';
import { 
  GetCategoriesUseCase, 
  GetCategoryByIdUseCase, 
  DeleteCategoryUseCase 
} from '@/domain/usecases/category.usecases';

/**
 * Фабрика Use Case'ов для категорий.
 * Собирает зависимости (Dependency Injection) для использования в API роутах.
 */

// Singleton инстанс Prisma (в реальном приложении лучше использовать отдельный модуль)
const prisma = new PrismaClient();

// Репозиторий
const categoryRepository = new PrismaCategoryRepository(prisma);

// Use Cases
export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
export const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
