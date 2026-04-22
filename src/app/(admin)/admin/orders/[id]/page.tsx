"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { OrderDetailsCard } from "@/styles/components/features/admin/orders/order-details-card";
import { Button } from "@/styles/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { OrderStatus } from "@/types";
import type { IOrderItem } from "@/types";

interface OrderDetails {
  id: string;
  user: { name: string | null; email: string | null };
  email: string;
  phone: string;
  address: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paidAt: Date | null;
  items: IOrderItem[];
  comment?: string | null;
  paymentMethod?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Заказ не найден");
          router.push("/admin/orders");
          return;
        }
        throw new Error("Не удалось загрузить заказ");
      }
      const data = await response.json();
      setOrder(data);
    } catch {
      toast.error("Не удалось загрузить заказ");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success("Статус изменен");
        fetchOrder();
      } else {
        toast.error("Ошибка при изменении статуса");
      }
    } catch {
      toast.error("Ошибка при изменении статуса");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Заказ не найден
      </div>
    );
  }

  return (
    <div className="spacep-y-6">
      <AdminBreadcrumb />

      <Button
        variant="outline"
        onClick={() => router.push("/admin/orders")}
        aria-label="Вернуться к списку заказов"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Вернуться к списку заказов
      </Button>

      <OrderDetailsCard order={order} onStatusChange={handleStatusChange} />
    </div>
  );
}
