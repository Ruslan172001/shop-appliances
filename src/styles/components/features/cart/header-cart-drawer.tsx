"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";

import CartItemCard from "./cart-item-card";
import { useCart, useClearCart, useRemoveFromCart } from "@/hooks/use-cart";
import { CartDrawerEmpty } from "./cart-drawer-empty";
import { CartDrawerFooter } from "./cart-drawer-footer";

import { Button } from "../../ui/button";
import { SkeletonMiniItem } from "../../ui/skeleton/skeleton-mini-item";
import { toast } from "sonner";

interface HeaderCartDrawerProps {
  children: React.ReactNode;
}

export default function HeaderCartDrawer({ children }: HeaderCartDrawerProps) {
  const { data: items = [], isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart.mutate(productId, {
      onSuccess: () => toast.info(`"${productName}" удалён из корзины`),
    });
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCart.mutate(undefined, {
      onSuccess: () => toast.info("Корзина очищена"),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="border-b p-2.5 pb-2 pr-12">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              Корзина ({itemCount})
            </SheetTitle>

            {items.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearCart}
                disabled={clearCart.isPending}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label="Очистить корзину"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          <SheetDescription>
            {itemCount === 0
              ? "Ваша корзина пуста"
              : "Товары, которые вы добавили"}
          </SheetDescription>
        </SheetHeader>

        {/* Контент */}
        {isLoading ? (
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            role="status"
            aria-busy="true"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMiniItem key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <CartDrawerEmpty />
        ) : (
          <>
            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            {/* Footer с итогами и кнопками */}
            <SheetFooter className="p-0">
              <CartDrawerFooter total={total} />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
