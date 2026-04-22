"use client";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/styles/components/ui/badge";
import { Button } from "@/styles/components/ui/button";
import { Checkbox } from "@/styles/components/ui/checkbox";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  inStock: boolean;
  quantity: number;
  category: { id: string; name: string };
  mainImage: string | null;
  reviewCount: number;
  rating: number;
  createdAt: Date;
}
export function getProductColumns(
  onDelete: (id: string) => void,
): ColumnDef<AdminProduct>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Выбрать ${row.getValue("name")}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Товар",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3 min-w-62.5">
            {product.mainImage ? (
              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs text-muted-foreground">Нет фото</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {product.category.name}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Цена
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = row.getValue<number>("price");
        const oldPrice = row.original.oldPrice;
        return (
          <div>
            <p className="font-semibold">{price.toLocaleString("ru-RU")}₽</p>
            {oldPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {oldPrice.toLocaleString("ru-RU")}₽
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "inStock",
      header: "В наличии",
      cell: ({ row }) =>
        row.getValue("inStock") ? (
          <Badge className="bg-green-500">В наличии</Badge>
        ) : (
          <Badge variant="destructive">Нет в наличии</Badge>
        ),
    },
    {
      accessorKey: "rating",
      header: "Рейтинг",
      cell: ({ row }) => {
        const rating = row.getValue<number>("rating");
        const count = row.original.reviewCount;
        return (
          <div>
            <p className="font-medium">
              {rating > 0 ? rating.toFixed(1) : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {count > 0 ? `${count} отзывов` : "Нет отзывов"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Дата",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.getValue<Date>("createdAt")).toLocaleDateString(
            "ru-RU",
          )}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              aria-label={`Редактировать ${product.name}`}
            >
              <Link href={`/admin/products/${product.id}`}>
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product.id)}
              aria-label={`Удалить ${product.name}`}
              className="text-destructive hover:text-destructive"
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
