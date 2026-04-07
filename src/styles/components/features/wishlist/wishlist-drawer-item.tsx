"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";

interface WishlistDrawerItemProps {
  productId: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  onAddToCart: () => void;
  onRemove: () => void;
}

export function WishlistDrawerItem({
  productId,
  name,
  slug,
  price,
  oldPrice,
  image,
  inStock,
  onAddToCart,
  onRemove,
}: WishlistDrawerItemProps) {
  return (
    <div className="flex gap-3 p-2 border rounded-lg">
      <Link
        href={`/product/${slug}`}
        className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden"
        aria-label={name}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${slug}`}
          className="font-medium text-sm line-clamp-2 hover:underline"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-sm">
            {price.toLocaleString("ru-RU")} ₽
          </span>
          {oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {oldPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            size="sm"
            disabled={!inStock}
            onClick={onAddToCart}
            aria-label={
              inStock
                ? `Добавить ${name} в корзину`
                : "Товар отсутствует в наличии"
            }
          >
            <ShoppingCart className="h-3 w-3 mr-1" aria-hidden="true" />
            В корзину
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            aria-label={`Удалить ${name} из избранного`}
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}
