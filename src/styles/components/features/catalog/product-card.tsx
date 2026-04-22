"use client";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";

import { useAddToWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import {
  calculateDiscountPercent,
  getMainImage,
  isInStock,
} from "@/styles/lib/product-utils";
import { StarRating } from "../../shared/star-rating";
import { IProductCardData } from "@/types";

interface ProductCardProps {
  product: IProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const discount = calculateDiscountPercent(
    product.oldPrice ?? null,
    product.price,
  );
  const inStock = isInStock(product.quantity);
  const mainImage = getMainImage(product.images);

  const handleToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart.mutate(
      {
        item: {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
          image: mainImage?.url || "",
          inStock: inStock,
        },
      },
      {
        onSuccess: () => toast.success("Добавлено в корзину"),
        onError: () => toast.error("Ошибка при добавлении в корзину"),
      },
    );
  };
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    addToWishlist.mutate(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        image: product.images[0]?.url || "",
        inStock: inStock,
      },
      {
        onSuccess: () => toast.success("Добавлено в избранное"),
        onError: () => toast.error("Ошибка при добавлении в избранное"),
      },
    );
  };
  return (
    <Card className="group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link
        href={`/product/${product.slug}`}
        target="_blank"
        className="relative block aspect-square overflow-hidden bg-gray-100"
        aria-label={product.name}
      >
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div
            className="flex items-center justify-center h-full text-gray-400"
            role="img"
            aria-label="Изображение отсутствует"
          >
            Нет фото
          </div>
        )}

        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            <span className="sr-only">Скидка: </span>-{discount}%
          </Badge>
        )}

        {!inStock && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-white font-semibold">Нет в наличии</span>
          </div>
        )}
      </Link>

      <CardContent className="flex-1 p-4">
        <Link href={`/product/${product.slug}`} target="_blank">
          <h3 className="font-medium text-lg line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>

        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount} отзывов)
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xl font-bold">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="shrink-0"
            disabled={!inStock}
            onClick={handleToCart}
            size="sm"
            aria-label={
              inStock
                ? `Добавить ${product.name} в корзину`
                : "Товар отсутствует в наличии"
            }
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />В корзину
          </Button>

          <Button
            className="shrink-0"
            onClick={handleToggleWishlist}
            size="sm"
            variant="ghost"
            aria-label="Добавить в избранное"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
