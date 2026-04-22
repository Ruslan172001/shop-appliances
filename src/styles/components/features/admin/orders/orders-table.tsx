"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/styles/components/ui/badge";
import { Button } from "@/styles/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import { Eye, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { orderStatusColors, orderStatusLabels } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export interface AdminOrder {
  id: string;
  user: { name: string | null; email: string | null };
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paidAt: Date | null;
  itemsCount: number;
  email: string;
  phone: string;
}

export function getOrderColumns(
  onStatusChange: (id: string, status: OrderStatus) => void,
): ColumnDef<AdminOrder>[] {
  return [
    {
      accessorKey: "id",
      header: "Заказ",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div>
            <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground truncate max-w-37.5">
              {order.user.name || order.email || "Аноним"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Дата
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {new Date(row.getValue("createdAt")).toLocaleDateString("ru-RU")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Select
            value={order.status}
            onValueChange={(value) =>
              onStatusChange(order.id, value as OrderStatus)
            }
          >
            <SelectTrigger
              className="w-40 h-7"
              aria-label={`Изменить статус заказа ${order.id}`}
            >
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
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Сумма
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold whitespace-nowrap">
          {Number(row.getValue<number>("total")).toLocaleString("ru-RU")} ₽
        </span>
      ),
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            asChild
            aria-label={`Просмотреть заказ ${order.id}`}
          >
            <Link href={`/admin/orders/${order.id}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
        );
      },
      enableSorting: false,
    },
  ];
}
