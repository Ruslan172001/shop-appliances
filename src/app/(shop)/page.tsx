import prisma from "@/lib/prisma";
import ProductCard from "@/styles/components/features/catalog/product-card";
import Hero from "@/styles/components/layout/hero";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/styles/components/ui/carousel";
import { ArrowRight, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/styles/components/ui/button";
import type { IProduct, ICategory, IProductImage } from "@/types";
import Advantages from "@/styles/components/layout/advantages";
import { HomepagePromo } from "@/styles/components/features/home-page-promo";

// --- Типы данных из Prisma ---
type RawProduct = Awaited<ReturnType<typeof getPopularProducts>>[number];

// --- Трансформация данных ---
function transformProduct(product: RawProduct): IProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    oldPrice: product.oldPrice?.toNumber(),
    quantity: product.quantity,
    rating: product.rating,
    reviewCount: product.reviewCount,
    model: product.model,
    color: product.color,
    country: product.country,
    specifications: product.specifications as IProduct["specifications"],
    inStock: product.quantity > 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
      description: product.category.description,
      parentId: product.category.parentId,
      createdAt: product.category.createdAt,
      updatedAt: product.category.updatedAt,
    } as ICategory,
    images: product.images.map(
      (img): IProductImage => ({
        id: img.id,
        url: img.url,
        alt: img.alt ?? null,
        isMain: img.isMain,
        order: img.order,
      }),
    ),
  };
}

// --- Запрос популярных товаров ---
async function getPopularProducts() {
  return prisma.product.findMany({
    where: { quantity: { gt: 0 } },
    orderBy: [{ reviewCount: "desc" }, { rating: "desc" }],
    take: 8,
    include: {
      category: true,
      images: {
        where: { isMain: true },
        orderBy: { order: "asc" },
        take: 1,
      },
    },
  });
}

// --- Запрос товаров со скидкой ---
async function getSaleProducts() {
  return prisma.product.findMany({
    where: {
      quantity: { gt: 0 },
      oldPrice: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      category: true,
      images: {
        where: { isMain: true },
        orderBy: { order: "asc" },
        take: 1,
      },
    },
  });
}

// --- Главная страница ---
export default async function HomePage() {
  const [popularProducts, saleProducts] = await Promise.all([
    getPopularProducts(),
    getSaleProducts(),
  ]);

  const popular = popularProducts.map(transformProduct);
  const sale = saleProducts.map(transformProduct);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Секция (Баннер) */}
      <Hero />
      <Advantages />
      <HomepagePromo />
      <div className="container mx-auto py-12 space-y-16">
        {/* 2. Секция: Популярные товары */}
        {popular.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Популярные товары</h2>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/catalog">
                  Смотреть все
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {popular.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 py-2"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </section>
        )}

        {/* 3. Секция: Товары со скидкой */}
        {sale.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Tag className="h-6 w-6 text-red-500" />
                <h2 className="text-2xl font-bold">Товары со скидкой</h2>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/catalog?sale=true">
                  Все акции
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {sale.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 py-2"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </section>
        )}

        {/* Если товаров нет */}
        {popular.length === 0 && sale.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">
              Товары пока не добавлены
            </h2>
            <p className="text-muted-foreground mb-6">
              Загляните в каталог, чтобы увидеть доступные товары
            </p>
            <Button asChild>
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
