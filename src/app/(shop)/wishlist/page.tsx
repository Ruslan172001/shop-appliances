"use client";

import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { Spinner } from "@/styles/components/ui/spinner";
import { Button } from "@/styles/components/ui/button";
import { Heart, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => toast.info(`"${productName}" удалён из избранного`),
    });
  };

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart.mutate(
      {
        item: {
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          price: item.price,
          oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
          image: item.image,
          inStock: item.inStock,
        },
      },
      {
        onSuccess: () => {
          toast.success("Добавлено в корзину");
          handleRemove(item.productId, item.name);
        },
        onError: () => toast.error("Ошибка при добавлении в корзину"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center min-h-100">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-6">
          <Heart className="h-32 w-32 text-muted-foreground opacity-20" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Список желаний пуст</h1>
            <p className="text-muted-foreground max-w-md">
              Добавляйте понравившиеся товары, чтобы вернуться к ним позже
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/catalog">
              Перейти в каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Список желаний</h1>
          <p className="text-muted-foreground mt-1">
            {items.length}{" "}
            {items.length === 1
              ? "товар"
              : items.length < 5
                ? "товара"
                : "товаров"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="group relative flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Изображение */}
            <Link
              href={`/product/${item.slug}`}
              className="relative block aspect-square overflow-hidden bg-gray-100"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    Нет в наличии
                  </span>
                </div>
              )}
            </Link>

            {/* Информация */}
            <div className="flex-1 p-4">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium hover:underline line-clamp-2 block"
              >
                {item.name}
              </Link>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl font-bold">
                  {item.price.toLocaleString("ru-RU")} ₽
                </span>
                {item.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {item.oldPrice.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>
            </div>

            {/* Действия */}
            <div className="p-4 pt-0 flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                disabled={!item.inStock}
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />В корзину
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRemove(item.productId, item.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
