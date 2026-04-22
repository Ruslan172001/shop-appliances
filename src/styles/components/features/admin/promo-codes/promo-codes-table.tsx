"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/styles/components/ui/button";
import { Badge } from "@/styles/components/ui/badge";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export interface AdminPromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  description: string | null;
}

function formatDiscount(p: AdminPromoCode) {
  if (p.type === "PERCENT") {
    return `${p.value}%`;
  }
  return `${Number(p.value).toLocaleString("ru-RU")} ₽`;
}

function usageLabel(p: AdminPromoCode) {
  if (p.usageLimit <= 0) {
    return `${p.usageCount} / ∞`;
  }
  return `${p.usageCount} / ${p.usageLimit}`;
}

function statusBadge(p: AdminPromoCode) {
  const now = Date.now();
  const until = new Date(p.validUntil).getTime();
  const from = new Date(p.validFrom).getTime();

  if (!p.isActive) {
    return <Badge variant="secondary">Выключен</Badge>;
  }
  if (now < from) {
    return <Badge variant="outline">Скоро</Badge>;
  }
  if (now > until) {
    return <Badge variant="destructive">Истёк</Badge>;
  }
  return <Badge className="bg-green-600 hover:bg-green-600">Действует</Badge>;
}

export function getPromoCodeColumns(
  onDelete: (id: string, code: string) => void,
): ColumnDef<AdminPromoCode>[] {
  return [
    {
      accessorKey: "code",
      header: "Код",
      cell: ({ row }) => (
        <span className="font-mono font-semibold">{row.original.code}</span>
      ),
    },
    {
      id: "discount",
      header: "Скидка",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDiscount(row.original)}</span>
      ),
    },
    {
      accessorKey: "minOrderAmount",
      header: "Мин. заказ",
      cell: ({ row }) => (
        <span className="tabular-nums whitespace-nowrap">
          {Number(row.original.minOrderAmount).toLocaleString("ru-RU")} ₽
        </span>
      ),
    },
    {
      id: "period",
      header: "Период",
      cell: ({ row }) => {
        const p = row.original;
        const opts: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        };
        return (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {new Date(p.validFrom).toLocaleDateString("ru-RU", opts)} —{" "}
            {new Date(p.validUntil).toLocaleDateString("ru-RU", opts)}
          </span>
        );
      },
    },
    {
      id: "usage",
      header: "Использований",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm">{usageLabel(row.original)}</span>
      ),
    },
    {
      id: "status",
      header: "Статус",
      cell: ({ row }) => statusBadge(row.original),
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button variant="outline" size="icon-sm" asChild>
              <Link href={`/admin/promo-codes/${p.id}`} aria-label="Редактировать">
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              aria-label="Удалить промокод"
              onClick={() => onDelete(p.id, p.code)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}
