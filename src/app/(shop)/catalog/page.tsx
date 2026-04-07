"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/styles/components/features/catalog/product-card";
import { CatalogFilters } from "@/styles/components/features/catalog/catalog-filters";
import { CatalogToolbar } from "@/styles/components/features/catalog/catalog-toolbar";
import { CatalogPagination } from "@/styles/components/features/catalog/catalog-pagination";
import { EmptyCatalogResults } from "@/styles/components/features/catalog/empty-catalog-results";
import { SkeletonProductCard } from "@/styles/components/ui/skeleton/skeleton-product-card";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { useState } from "react";

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sort") || "createdAt";
  const currentSortOrder = searchParams.get("order") || "desc";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [showFilters, setShowFilters] = useState(false);

  const { products, loading, error, pagination } = useCatalogProducts(
    currentSortBy,
    currentSortOrder,
    currentPage,
  );

  const handleSortChange = (field: string, order: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", field);
    params.set("order", order);
    params.set("page", "1");
    router.push(`/catalog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/catalog?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/catalog");
  };

  if (loading) {
    return (
      <div
        className="container mx-auto py-8"
        role="status"
        aria-busy="true"
        aria-label="Загрузка каталога товаров"
      >
        <div className="sr-only" aria-live="polite">
          Загрузка товаров...
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container mx-auto py-8 flex items-center justify-center min-h-100"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-destructive" role="status">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8" aria-label="Каталог товаров">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {products.length > 0 &&
          `Показано ${products.length} товаров, страница ${currentPage} из ${pagination?.totalPages || 1}`}
        {products.length === 0 && pagination && "Товары не найдены"}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Каталог товаров</h1>
        <CatalogToolbar
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          totalItems={pagination?.total || 0}
          sortBy={currentSortBy}
          sortOrder={currentSortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="flex gap-8">
        <aside
          id="catalog-filters"
          aria-label="Фильтры каталога"
          className={`w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="sticky top-4">
            <CatalogFilters key={searchParams.toString()} />
          </div>
        </aside>

        <section className="flex-1" aria-label="Список товаров">
          {products.length === 0 ? (
            <EmptyCatalogResults onReset={handleResetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <CatalogPagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
