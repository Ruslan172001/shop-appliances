"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/styles/components/features/catalog/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/styles/components/ui/pagination";
import { CatalogFilters } from "@/styles/components/features/catalog/catalog-filters";
import { Button } from "@/styles/components/ui/button";
import { Filter } from "lucide-react";
import { SkeletonProductCard } from "@/styles/components/ui/skeleton/skeleton-product-card";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { useState } from "react";

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Читаем сортировку и страницу из URL
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
    params.set("page", "1"); // Сбрасываем страницу при смене сортировки
    router.push(`/catalog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/catalog?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
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
      <div className="container mx-auto py-8 flex items-center justify-center min-h-100">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Каталог товаров</h1>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>

          <span className="text-muted-foreground">
            Найдено товаров: {pagination?.total || 0}
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Сортировать:</span>
            <Select
              value={currentSortBy}
              onValueChange={(v) => handleSortChange(v, currentSortOrder)}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="По умолчанию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">По дате</SelectItem>
                <SelectItem value="price">По цене</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={currentSortOrder}
              onValueChange={(v) => handleSortChange(currentSortBy, v)}
            >
              <SelectTrigger className="w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">По убыванию</SelectItem>
                <SelectItem value="asc">По возрастанию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside
          className={`w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="sticky top-4">
            <CatalogFilters key={searchParams.toString()} />
          </div>
        </aside>

        <main className="flex-1">
          {products.length === 0 ? (
            <div className="flex items-center justify-center min-h-100">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Товары не найдены</p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/catalog")}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    )
                      .filter((page) => {
                        const delta = 2;
                        const range = [
                          1,
                          currentPage - delta,
                          currentPage,
                          currentPage + delta,
                          pagination.totalPages,
                        ];
                        return range.includes(page);
                      })
                      .reduce<number[]>((acc, page, idx, arr) => {
                        if (idx === 0) return [page];
                        if (page - arr[idx - 1] === 1) return [...acc, page];
                        if (page - arr[idx - 1] === 2)
                          return [...acc, page - 1, page];
                        return [...acc, -1, page];
                      }, [])
                      .map((page, idx) =>
                        page === -1 ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <span className="flex size-8 items-center justify-center">
                              ...
                            </span>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < pagination.totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
