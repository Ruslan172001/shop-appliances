"use client";

import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { Spinner } from "@/styles/components/ui/spinner";
import {
  EmptyWishlist,
  WishlistGridItem,
} from "@/styles/components/features/wishlist";
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
      <div
        className="container mx-auto py-8 flex justify-center min-h-100"
        role="status"
        aria-busy="true"
        aria-label="Загрузка списка желаний"
      >
        <div className="sr-only" aria-live="polite">
          Загрузка избранных товаров...
        </div>
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <main className="container mx-auto py-8" aria-label="Список желаний">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Список желаний</h1>
        <p
          className="text-muted-foreground mt-1"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {items.length}{" "}
          {items.length === 1
            ? "товар"
            : items.length < 5
              ? "товара"
              : "товаров"}
        </p>
      </div>

      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        aria-label="Избранные товары"
      >
        {items.map((item) => (
          <WishlistGridItem
            key={item.productId}
            productId={item.productId}
            name={item.name}
            slug={item.slug}
            price={item.price}
            oldPrice={item.oldPrice ? Number(item.oldPrice) : undefined}
            image={item.image}
            inStock={item.inStock}
            onAddToCart={() => handleAddToCart(item)}
            onRemove={() => handleRemove(item.productId, item.name)}
          />
        ))}
      </section>
    </main>
  );
}
