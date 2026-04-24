"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Calendar, CreditCard, Package, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/user-utils";
import { formatPrice } from "@/lib/user-utils";
import type { IOrder, IOrderItem } from "types";
import { orderStatusLabels, orderStatusColors } from "@/lib/order-status";
interface OrderCardProps {
  order: IOrder & {
    items: IOrderItem[];
  };
}

const statusLabels = orderStatusLabels;
const statusColors = orderStatusColors;

export function OrderCard({ order }: OrderCardProps) {
  const displayItems = order.items.slice(0, 3);
  const remainingCount = order.items.length - 3;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Шапка */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              Заказ #{order.id.slice(-8).toUpperCase()}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
          <Badge
            className={`${statusColors[order.status] || "bg-gray-100 text-gray-800"} border`}
          >
            {statusLabels[order.status] || order.status}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      {/* Список товаров */}
      <CardContent className="pt-4 pb-3">
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              {item.image && (
                <div className="relative w-14 h-14 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.quantity} шт. × {formatPrice(Number(item.price))}
                </p>
              </div>
              <p className="font-semibold text-sm shrink-0">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}

          {remainingCount > 0 && (
            <p className="text-sm text-muted-foreground">
              +{remainingCount} товаров
            </p>
          )}
        </div>
      </CardContent>

      <Separator />

      {/* Подвал: итого + действия */}
      <CardFooter className="pt-3 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" />
            <span>{formatPrice(Number(order.total))}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            <span>{order.items.length} товаров</span>
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === "PENDING" && (
            <Button asChild size="sm">
              <Link href={`/order/${order.id}/pay`}>Оплатить</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/order/${order.id}`}>
              Подробнее
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
