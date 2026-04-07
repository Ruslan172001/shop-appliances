import { useState, useEffect } from "react";
import { ICategory, IProduct } from "@/types";
import { useDebounce } from "./use-debounce";

interface CategorySearchResult extends Omit<
  ICategory,
  "parent" | "children" | "createdAt" | "updatedAt"
> {
  _count?: {
    products: number;
  };
}

interface ProductSearchResult extends Omit<
  IProduct,
  | "rating"
  | "reviewCount"
  | "specifications"
  | "badge"
  | "createdAt"
  | "updatedAt"
  | "inStock"
> {
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    isMain: boolean;
    order: number;
  }>;
}

export interface SearchResult {
  products: ProductSearchResult[];
  categories: CategorySearchResult[];
}

export function useSearch(query: string) {
  const debounceQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult>({
    products: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function search() {
      if (debounceQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(debounceQuery)}&limit=5`,
            { signal: controller.signal },
          );
          if (!res.ok) return;
          const data = await res.json();
          setResults(data);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error("Error fetching search results:", error);
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      } else {
        setResults({ products: [], categories: [] });
        setIsLoading(false);
      }
    }

    search();

    return () => {
      controller.abort();
    };
  }, [debounceQuery]);

  return { results, isLoading };
}
