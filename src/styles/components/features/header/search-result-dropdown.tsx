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
}

export default function SearchResultDropdown({
  isOpen,
  results,
  isLoading,
  query,
}: SearchResultDropdownProps) {
  const totalResults = results.products.length + results.categories.length;

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
      {isLoading ? (
        <SkeletonSearchResult />
      ) : totalResults > 0 ? (
        <>
          {results.categories.length > 0 && (
            <div className="border-b">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Категории
              </div>
              {results.categories.map((category) => (
                <CategoryMiniCard key={category.id} category={category} />
              ))}
            </div>
          )}

          {results.products.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Товары
              </div>
              {results.products.map((product) => (
                <ProductMiniCard key={product.id} product={product} />
              ))}
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
        <div className="p-4 text-center text-muted-foreground">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
