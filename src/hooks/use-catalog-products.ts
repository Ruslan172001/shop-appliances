import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { IProduct, IProductSpecifications } from "@/types";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  quantity: number;
  rating: number;
  reviewCount: number;
  model: string | null;
  color: string | null;
  country: string | null;
  specifications: Record<string, string | number | boolean | null> | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  images: {
    id: string;
    url: string;
    alt: string | null;
    isMain: boolean;
    order: number;
  }[];
};

function transformProduct(raw: ApiProduct): IProduct {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    oldPrice: raw.oldPrice ?? undefined,
    quantity: raw.quantity,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    model: raw.model,
    color: raw.color,
    country: raw.country,
    specifications: raw.specifications as IProductSpecifications,
    inStock: raw.quantity > 0,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    category: {
      id: raw.category.id,
      name: raw.category.name,
      slug: raw.category.slug,
      description: raw.category.description ?? null,
      parentId: raw.category.parentId ?? null,
      createdAt: new Date(raw.category.createdAt),
      updatedAt: new Date(raw.category.updatedAt),
    },
    images: (raw.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? null,
      isMain: img.isMain,
      order: img.order,
    })),
  };
}

export function useCatalogProducts(
  sortBy: string,
  sortOrder: string,
  page: number,
) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const query = searchParams.get("q");
        if (query) params.set("q", query);
        if (searchParams.get("category"))
          params.set("category", searchParams.get("category")!);
        if (searchParams.get("minPrice"))
          params.set("minPrice", searchParams.get("minPrice")!);
        if (searchParams.get("maxPrice"))
          params.set("maxPrice", searchParams.get("maxPrice")!);
        if (searchParams.get("inStock"))
          params.set("inStock", searchParams.get("inStock")!);
        if (searchParams.get("rating"))
          params.set("rating", searchParams.get("rating")!);

        params.set("sort", sortBy);
        params.set("order", sortOrder);
        params.set("page", page.toString());
        params.set("limit", "12");

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Не удалось загрузить товары");
        }

        const data = await response.json();
        setProducts(data.products.map(transformProduct));
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page, searchParams, sortBy, sortOrder]);

  return { products, loading, error, pagination };
}
