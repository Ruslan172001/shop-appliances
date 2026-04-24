"use client";

import { Button } from "../../ui/button";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { isInStock } from "@/lib/product-utils";
import type { IProduct } from "types";

interface ProductActionsProps {
  product: IProduct;
}

export function ProductActions({ product }: ProductActionsProps) {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlistItems = [] } = useWishlist();
  const inWishlist = wishlistItems.some(
    (item) => item.productId === product.id,
  );
  const inStock = isInStock(product.quantity);

  const handleToCart = () => {
    addToCart.mutate({
      item: {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        image: product.images[0]?.url || "",
        inStock: inStock,
      },
    });
    toast.success("Добавлено в корзину");
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist.mutate(product.id, {
        onSuccess: () => toast.success("Удалено из избранного"),
        onError: () => toast.error("Ошибка при удалении из избранного"),
      });
    } else {
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
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        size="lg"
        className="flex-1"
        onClick={handleToCart}
        disabled={!inStock}
        aria-label={
          inStock
            ? `Добавить ${product.name} в корзину`
            : "Товар отсутствует в наличии"
        }
      >
        <ShoppingCart className="h-5 w-5 mr-2" aria-hidden="true" />
        {inStock ? "Добавить в корзину" : "Нет в наличии"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={handleToggleWishlist}
        className={inWishlist ? "text-red-500" : ""}
        aria-label={
          inWishlist
            ? `Удалить ${product.name} из избранного`
            : `Добавить ${product.name} в избранное`
        }
      >
        <Heart
          className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="lg" aria-label="Поделиться товаром">
        <Share2 className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
