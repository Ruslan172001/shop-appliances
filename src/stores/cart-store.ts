import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItem, ICartState } from "types";

export const useCartStore = create<ICartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId,
        );

        if (existingIndex !== -1) {
          const newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          set({ items: newItems });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getDiscount: () => {
        return get().items.reduce((total, item) => {
          if (!item.oldPrice) return total;
          return total + (item.oldPrice - item.price) * item.quantity;
        }, 0);
      },

      getFinalTotal: () => {
        return get().getTotal() - get().getDiscount();
      },
    }),
    { name: "cart-storage" },
  ),
);
