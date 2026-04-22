"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import { Badge } from "@/styles/components/ui/badge";
import { Button } from "@/styles/components/ui/button";
import { Separator } from "@/styles/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import Image from "next/image";
import {
  Calendar,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  CreditCard,
  Truck,
  Clock,
  Copy,
} from "lucide-react";
import { orderStatusColors, orderStatusLabels } from "@/lib/order-status";
import { formatPrice, formatDate } from "@/styles/lib/user-utils";
import type { IOrderDetails, OrderStatus } from "@/types";
import { toast } from "sonner";
import type { IOrderItem } from "@/types";

interface OrderDetailsCardProps {
  order: IOrderDetails;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderDetailsCard({
  order,
  onStatusChange,
}: OrderDetailsCardProps) {
  const copyId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success("ID заказа скопирован");
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            Заказ #{order.id.slice(-8).toUpperCase()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyId}
            aria-label="Копировать ID заказа"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={order.status}
            onValueChange={(val) => onStatusChange(val as OrderStatus)}
          >
            <SelectTrigger className="w-50" aria-label="Изменить статус заказа">
              <SelectValue>
                <Badge
                  variant="outline"
                  className={orderStatusColors[order.status]}
                >
                  {orderStatusLabels[order.status]}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(orderStatusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Информация о заказе */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-muted-foreground">Дата создания</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            {order.paidAt && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-muted-foreground">Оплачен</p>
                  <p className="font-medium">{formatDate(order.paidAt)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Package
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-muted-foreground">Товаров</p>
                <p className="font-medium">{order.items.length} шт.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Клиент */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" aria-hidden="true" />
              Клиент
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-muted-foreground">Имя</p>
                <p className="font-medium">{order.user.name || "Не указано"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-muted-foreground">Телефон</p>
                <p className="font-medium">{order.phone || "Не указан"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Доставка */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" aria-hidden="true" />
              Доставка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin
                className="h-4 w-4 text-muted-foreground mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-muted-foreground">Адрес</p>
                <p className="font-medium">{order.address || "Не указан"}</p>
              </div>
            </div>
            {order.comment && (
              <div className="flex items-start gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Комментарий</p>
                  <p className="font-medium mt-1">{order.comment}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Список товаров */}
      <Card>
        <CardHeader>
          <CardTitle>Товары в заказе</CardTitle>
          <CardDescription>
            {order.items.length} позиций на сумму {formatPrice(order.total)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                {item.image ? (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs text-muted-foreground">
                      Нет фото
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} шт. × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Итого:</span>
            <span className="text-xl font-bold">
              {formatPrice(order.total)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
