import { SearchResult } from "@/hooks/use-search";
import CategoryMiniCard from "../catalog/category-mini-card";
import ProductMiniCard from "../catalog/product-mini-card";
import Link from "next/link";
import { SkeletonSearchResult } from "../../ui/skeleton/skeleton-search-result";

interface SearchResultDropdownProps {
  isOpen: boolean;
  results: SearchResult;
  isLoading: boolean;
  query: string;
  activeIndex?: number;
  dropdownId?: string;
}

export default function SearchResultDropdown({
  isOpen,
  results,
  isLoading,
  query,
  activeIndex = -1,
  dropdownId,
}: SearchResultDropdownProps) {
  const totalResults = results.products.length + results.categories.length;

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <div
      id={dropdownId}
      role="listbox"
      aria-label="Результаты поиска"
      className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto"
    >
      {isLoading ? (
        <SkeletonSearchResult />
      ) : totalResults > 0 ? (
        <>
          {results.categories.length > 0 && (
            <div className="border-b">
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Категории
              </h3>
              {results.categories.map((category) => {
                const currentIndex = globalIndex++;
                return (
                  <div
                    key={category.id}
                    id={`search-result-${currentIndex}`}
                    role="option"
                    aria-selected={currentIndex === activeIndex}
                    tabIndex={currentIndex === activeIndex ? 0 : -1}
                    className={currentIndex === activeIndex ? "bg-accent" : ""}
                  >
                    <CategoryMiniCard category={category} />
                  </div>
                );
              })}
            </div>
          )}

          {results.products.length > 0 && (
            <div>
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Товары
              </h3>
              {results.products.map((product) => {
                const currentIndex = globalIndex++;
                return (
                  <div
                    key={product.id}
                    id={`search-result-${currentIndex}`}
                    role="option"
                    aria-selected={currentIndex === activeIndex}
                    tabIndex={currentIndex === activeIndex ? 0 : -1}
                    className={currentIndex === activeIndex ? "bg-accent" : ""}
                  >
                    <ProductMiniCard product={product} />
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t p-2">
            <Link
              href={`/catalog?search=${encodeURIComponent(query)}`}
              className="block text-center text-sm text-primary hover:underline py-1"
            >
              Показать все результаты ({totalResults})
            </Link>
          </div>
        </>
      ) : (
        <div role="status" className="p-4 text-center text-muted-foreground">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
