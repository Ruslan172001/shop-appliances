"use client";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/use-wishlist";
import { toast } from "sonner";
import type { IProduct } from "types";
import {
  calculateDiscountPercent,
  isInStock,
} from "@/styles/lib/product-utils";
import { StarRating } from "../../shared/star-rating";

interface ProductInfoProps {
  product: IProduct;
}
export default function ProductInfo({ product }: ProductInfoProps) {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlistItems = [] } = useWishlist();
  const inWishlist = wishlistItems.some(
    (item) => item.productId === product.id,
  );
  const discount = calculateDiscountPercent(
    product.oldPrice ?? null,
    product.price,
  );
  const inStock = isInStock(product.quantity);
  const handleToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {discount > 0 && <Badge className="bg-red-500">-{discount}%</Badge>}
          {inStock ? (
            <Badge className="bg-green-500">В наличии</Badge>
          ) : (
            <Badge variant="destructive">Нет в наличии</Badge>
          )}
        </div>
      </div>
      {product.rating > 0 && (
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-sm text-gray-500">
            ({product.rating.toFixed(1)})
          </span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} отзывов)
          </span>
        </div>
      )}
      <div className="space-y-1">
        <div className="flex items-center baseline gap-3">
          <span className="text-4xl font-bold">
            {product.price.toLocaleString()} ₽
          </span>
          {product.oldPrice && (
            <span className="text-xl text-muted-foreground line-through">
              {product.oldPrice.toLocaleString()} ₽
            </span>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2"> Описание</h3>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>
      {(product.model || product.color || product.country) && (
        <div className="space-y-2 text-sm">
          {product.model && (
            <div className=" flex gap-2">
              <span className="font-medium">{product.model}</span>
            </div>
          )}
          {product.color && (
            <div className=" flex gap-2">
              <span className="text-muted-foreground">Цвет:</span>
              <span className="font-medium">{product.color}</span>
            </div>
          )}
          {product.country && (
            <div className="flex gap-2">
              <span className="text-muted-foreground">Страна: </span>
              <span className="font-medium">{product.country}</span>
            </div>
          )}
        </div>
      )}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {inStock ? "Добавить в корзину" : "Нет в наличии"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleToggleWishlist}
          className={inWishlist ? "text-red-500" : ""}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🚚 Доставка:</span>
          <span>от 299 ₽</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🔄 Возврат:</span>
          <span>14 дней</span>
        </div>
      </div>
    </div>
  );
}
