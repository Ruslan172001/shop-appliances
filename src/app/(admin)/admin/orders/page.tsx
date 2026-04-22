"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/styles/components/features/admin/shared/data-table";
import { OrderFilters } from "@/styles/components/features/admin/orders/order-filters";
import {
  getOrderColumns,
  AdminOrder,
} from "@/styles/components/features/admin/orders/orders-table";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { PaginationState } from "@tanstack/react-table";
import type { OrderStatus } from "@/types";
import { toast } from "sonner";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(-1);

  const ferchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      });
      if (search) params.set("search", search);
      if (selectedStatus !== "all") params.set("status", selectedStatus);

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      setOrders(data.orders);
      setTotal(data.total);
      setPageCount(data.pageCount);
    } catch {
      toast.error("Ошибка при загрузке заказов");
    } finally {
      setLoading(false);
    }
  }, [pagination, search, selectedStatus]);

  useEffect(() => {
    ferchOrders();
  }, [ferchOrders]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (response.ok) {
        toast.success("Статус изменен");
        ferchOrders();
      } else {
        toast.error("Ошибка при изменении статуса");
      }
    } catch {
      toast.error("Ошибка при изменении статуса");
    }
  };

  const columns = getOrderColumns(handleStatusChange);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <div>
        <h2 className="text-2xl font-bold">Заказы</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Всего:{total.toLocaleString("ru-RU")}
        </p>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        isLoading={loading}
        searchPlaceholder="Поиск по ID, имени, email..."
        searchValue={search}
        onSearchChange={(value) => setSearch(value)}
        rowCount={total}
        pageCount={pageCount}
        externalPagination={pagination}
        onPaginationChange={setPagination}
        filters={
          <OrderFilters
            selectedStatus={selectedStatus}
            onStatusChange={(status) => {
              setSelectedStatus(status);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        }
      />
    </div>
  );
}
