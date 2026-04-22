import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { Badge } from "@/styles/components/ui/badge";
import Link from "next/link";
import { orderStatusColors, orderStatusLabels } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export interface RecentOrder {
  id: string;
  user: { name: string | null };
  total: number;
  status: OrderStatus;
  createdAt: Date;
  itemsCount: number;
}
interface AdminRecentOrdersProps {
  orders: RecentOrder[];
}
export function AdminRecentOrders({ orders }: AdminRecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Последние заказы</CardTitle>
          <CardDescription>Заказов пока нет</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние заказы</CardTitle>
        <CardDescription>{orders.length} последних заказов</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between p-3 border-rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <Badge
                    variant="outline"
                    className={orderStatusColors[order.status] || ""}
                  >
                    {orderStatusLabels[order.status] || order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {order.user.name || "Аноним"} · {order.itemsCount}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold">
                  {Number(order.total).toLocaleString("ru-RU")} ₽
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href="/admin/orders"
            className="block text-center text-sm text-primary hover:underline mt-4"
          >
            {" "}
            Все заказы →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
