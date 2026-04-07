"use client";

import { useCart, useClearCart, useRemoveFromCart } from "@/hooks/use-cart";
import { Button } from "@/styles/components/ui/button";
import { Trash2 } from "lucide-react";
import { SkeletonCartItem } from "@/styles/components/ui/skeleton/skeleton-cart-item";
import { toast } from "sonner";

import {
  CartItemList,
  CartEmpty,
  CartSummary,
} from "@/styles/components/features/cart";

export default function CartPage() {
  const { data: items = [], isLoading } = useCart();
  const clearCartMutation = useClearCart();
  const removeFromCartMutation = useRemoveFromCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCartMutation.mutate(productId, {
      onSuccess: () => toast.info(`"${productName}" удалён из корзины`),
    });
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    if (window.confirm("Вы уверены, что хотите очистить корзину?")) {
      clearCartMutation.mutate(undefined, {
        onSuccess: () => toast.info("Корзина очищена"),
      });
    }
  };

  if (isLoading) {
    return (
      <div
        className="container mx-auto py-8 space-y-4"
        role="status"
        aria-busy="true"
        aria-label="Загрузка корзины"
      >
        <div className="sr-only" aria-live="polite">
          Загрузка товаров в корзине...
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCartItem key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Корзина</h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={items.length === 0}
          aria-label="Очистить корзину"
        >
          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
          Очистить корзину
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="flex items-center justify-between text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>Товаров: {itemCount}</span>
          </div>

          <CartItemList items={items} onRemoveItem={handleRemoveItem} />
        </div>

        {/* Итоговая сумма */}
        <div className="lg:col-span-1">
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
}
