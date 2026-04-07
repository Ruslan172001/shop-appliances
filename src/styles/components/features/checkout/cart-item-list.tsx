"use client";

import CartItemCard from "@/styles/components/features/cart/cart-item-card";
import type { ICartItem } from "@/types/cart.interface";

interface CartItemListProps {
  items: ICartItem[];
  onRemoveItem: (productId: string, productName: string) => void;
}

export function CartItemList({ items, onRemoveItem }: CartItemListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item.productId}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}
