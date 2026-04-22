# Архитектура Чистого Кода (Clean Architecture)

## 📁 Структура проекта

```
src/
├── domain/                     # Слой доменной логики (не зависит от фреймворков и БД)
│   ├── entities/               # Доменные сущности с бизнес-правилами
│   │   ├── category.entity.ts
│   │   └── product.entity.ts
│   ├── repositories/           # Интерфейсы репозиториев (контракты)
│   │   ├── category.repository.interface.ts
│   │   └── product.repository.interface.ts
│   └── usecases/               # Бизнес-сценарии использования
│       └── category.usecases.ts
│
├── infrastructure/             # Слой инфраструктуры (зависит от внешних систем)
│   └── repositories/           # Реализации репозиториев
│       └── prisma-category.repository.ts
│
├── application/                # Слой приложения (оркестрация)
│   └── factories/              # Фабрики для DI
│       └── category.factory.ts
│
├── app/                        # Framework слой (Next.js)
│   └── api/                    # API роуты (тонкие контроллеры)
│
└── types/                      # Общие типы и интерфейсы
```

## 🔑 Принципы

### 1. Правило зависимостей (Dependency Rule)
- **Domain** → не зависит ни от чего
- **Infrastructure** → зависит от Domain
- **Application** → зависит от Domain
- **Framework (App)** → зависит от Application и Domain

### 2. Разделение ответственности
- **Entities**: Бизнес-правила и состояние
- **Repositories**: Контракты для доступа к данным
- **Use Cases**: Конкретные бизнес-сценарии
- **Infrastructure**: Реализация работы с БД/API
- **Controllers (Routes)**: Обработка HTTP-запросов

### 3. Инверсия зависимостей (DIP)
Контроллеры зависят от абстракций (интерфейсов), а не от конкретных реализаций.

## 📝 Пример использования в API роуте

```typescript
// src/app/api/admin/categories/route.ts
import { NextResponse } from 'next/server';
import { getCategoriesUseCase } from '@/application/factories/category.factory';

export async function GET() {
  try {
    const categories = await getCategoriesUseCase.execute();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}
```

## ✅ Преимущества

1. **Тестируемость**: Use Cases легко тестировать без БД
2. **Заменяемость**: Можно сменить Prisma на другую ORM без изменения бизнес-логики
3. **Читаемость**: Четкое разделение ответственности
4. **Масштабируемость**: Легко добавлять новую функциональность

## 🔄 Следующие шаги

1. Создать `PrismaProductRepository` по аналогии с `PrismaCategoryRepository`
2. Обновить существующие API роуты для использования Use Cases
3. Добавить валидацию данных через DTO в слое Application
4. Покрыть Use Cases юнит-тестами
