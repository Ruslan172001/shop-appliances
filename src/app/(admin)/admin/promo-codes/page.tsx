"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/styles/components/features/admin/shared/data-table";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { Button } from "@/styles/components/ui/button";
import { Plus } from "lucide-react";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  getPromoCodeColumns,
  type AdminPromoCode,
} from "@/styles/components/features/admin/promo-codes/promo-codes-table";
import { PromoCodeFilters } from "@/styles/components/features/admin/promo-codes/promo-code-filters";

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<AdminPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedActive, setSelectedActive] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(-1);

  const fetchPromoCodes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      });
      if (search.trim()) params.set("search", search.trim());
      if (selectedActive !== "all") params.set("active", selectedActive);

      const res = await fetch(`/api/admin/promo-codes?${params}`);
      if (!res.ok) {
        toast.error("Ошибка при загрузке промокодов");
        return;
      }
      const data = await res.json();
      setPromoCodes(data.promoCodes ?? []);
      setTotal(data.total ?? 0);
      setPageCount(data.pageCount ?? -1);
    } catch {
      toast.error("Ошибка при загрузке промокодов");
    } finally {
      setLoading(false);
    }
  }, [pagination, search, selectedActive]);

  useEffect(() => {
    void fetchPromoCodes();
  }, [fetchPromoCodes]);

  const handleDelete = async (id: string, code: string) => {
    if (
      !confirm(`Удалить промокод «${code}»? Это действие нельзя отменить.`)
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Промокод удалён");
        void fetchPromoCodes();
      } else {
        toast.error("Не удалось удалить");
      }
    } catch {
      toast.error("Не удалось удалить");
    }
  };

  const columns = getPromoCodeColumns(handleDelete);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Промокоды</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Всего: {total.toLocaleString("ru-RU")}
          </p>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/admin/promo-codes/create">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Новый промокод
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={promoCodes}
        isLoading={loading}
        searchPlaceholder="Код или описание..."
        searchValue={search}
        onSearchChange={setSearch}
        rowCount={total}
        pageCount={pageCount}
        externalPagination={pagination}
        onPaginationChange={setPagination}
        filters={
          <PromoCodeFilters
            selectedActive={selectedActive}
            onActiveChange={(v) => {
              setSelectedActive(v);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />
        }
      />
    </div>
  );
}
