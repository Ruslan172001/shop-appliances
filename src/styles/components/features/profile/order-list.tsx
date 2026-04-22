"use client";
import { Button } from "../../ui/button";
import { Package } from "lucide-react";
import Link from "next/link";
import { OrderCard } from "./order-card";
import { useUserOrders } from "@/hooks/use-user-orders";
import { OrderWithItems } from "@/types";
import { SkeletonOrder } from "../../ui/skeleton/skeleton-order";

export function OrderList() {
  const { data: orders = [], isLoading } = useUserOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonOrder key={i} />
        ))}
      </div>
    );
  }
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-50 text-center space-y-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">У вас пока нет заказов</p>
          <p className="text-muted-foreground">
            Оформите первый заказ в каталоге
          </p>
        </div>
        <Button asChild>
          <Link href="/catalog">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((order: OrderWithItems) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
