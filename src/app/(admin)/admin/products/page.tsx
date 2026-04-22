"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/styles/components/features/admin/shared/data-table";
import { ProductFilters } from "@/styles/components/features/admin/products/product-filters";
import {
  getProductColumns,
  AdminProduct,
} from "@/styles/components/features/admin/products/product-table";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { Button } from "@/styles/components/ui/button";
import { Plus } from "lucide-react";
import { PaginationState } from "@tanstack/react-table";
import { useCategories } from "@/hooks/use-category";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(-1);

  const { data: categories = [] } = useCategories();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      });
      if (search) params.set("search", search);
      if (selectedCategory !== "all")
        params.set("categoryId", selectedCategory);
      if (inStock) params.set("inStock", "true");

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();

      setProducts(data.products);
      setTotal(data.total);
      setPageCount(data.pageCount);
    } catch {
      toast.error("Ошибка при загрузке товаров");
    } finally {
      setLoading(false);
    }
  }, [pagination, search, selectedCategory, inStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот товар?")) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Товар удален");
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Ошибка при удалении");
      }
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const columns = getProductColumns(handleDelete);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Товары</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Всего: {total.toLocaleString("ru-RU")}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/create">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Добавить товар
          </Link>
        </Button>
      </div>

      <DataTable<AdminProduct, unknown>
        columns={columns}
        data={products}
        isLoading={loading}
        searchPlaceholder="Поиск товаров..."
        searchValue={search}
        onSearchChange={(val) => setSearch(val)}
        rowCount={total}
        pageCount={pageCount}
        externalPagination={pagination}
        onPaginationChange={setPagination}
        filters={
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            inStock={inStock}
            onInStockChange={(checked) => {
              setInStock(checked);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        }
      />
    </div>
  );
}
