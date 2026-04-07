"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface WishlistGridItemProps {
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

export function WishlistGridItem({
  productId,
  name,
  slug,
  price,
  oldPrice,
  image,
  inStock,
  onAddToCart,
  onRemove,
}: WishlistGridItemProps) {
  return (
    <div
      key={productId}
      className="group relative flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Изображение */}
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
        aria-label={name}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {!inStock && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-white font-semibold text-sm">
              Нет в наличии
            </span>
          </div>
        )}
      </Link>

      {/* Информация */}
      <div className="flex-1 p-4">
        <Link
          href={`/product/${slug}`}
          className="font-medium hover:underline line-clamp-2 block"
        >
          {name}
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold">
            {price.toLocaleString("ru-RU")} ₽
          </span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {oldPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
      </div>

      {/* Действия */}
      <div className="p-4 pt-0 flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          disabled={!inStock}
          onClick={onAddToCart}
          aria-label={
            inStock
              ? `Добавить ${name} в корзину`
              : "Товар отсутствует в наличии"
          }
        >
          <ShoppingCart className="h-4 w-4 mr-1" aria-hidden="true" />
          В корзину
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRemove}
          aria-label={`Удалить ${name} из избранного`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
