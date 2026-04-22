"use client";
import { useEffect, useState } from "react";
import { AdminStatsCards } from "@/styles/components/features/admin/dashboard/admin-stats-cards";
import {
  AdminRecentOrders,
  RecentOrder,
} from "@/styles/components/features/admin/dashboard/admin-recent-orders";
import {
  AdminTopProducts,
  TopProduct,
} from "@/styles/components/features/admin/dashboard/admin-top-products";
import { Spinner } from "@/styles/components/ui/spinner";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalReviews: number;
  revenue: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spinner />
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Ошибка при загрузке статистики
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <AdminBreadcrumb />
      <div>
        <h2 className="text-2xl font-bold mb-6">Обзор</h2>
        <AdminStatsCards
          stats={{
            totalProducts: stats.totalProducts,
            totalOrders: stats.totalOrders,
            totalReviews: stats.totalReviews,
            revenue: stats.revenue,
          }}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <AdminRecentOrders orders={stats.recentOrders} />
        <AdminTopProducts products={stats.topProducts} />
      </div>
    </div>
  );
}
