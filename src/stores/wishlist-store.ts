"use client";

import { IWishlistItem, IWishlistState } from "types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create<IWishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      // Добавить товар
      addItem: (item: Omit<IWishlistItem, "addedAt">) => {
        const exists = get().items.some((i) => i.productId === item.productId);

        if (exists) return;

        set((state) => ({
          items: [...state.items, { ...item, addedAt: new Date() }],
        }));
      },

      // Удалить товар
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      // Очистить всё
      clearWishlist: () => {
        set({ items: [] });
      },

      // Получить количество
      getItemCount: () => {
        return get().items.length;
      },

      // Проверить наличие
      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      // Получить все товары
      getAllItems: () => {
        return get().items;
      },

      // Переместить в корзину
      moveToCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      // Обновить товар
      updateItem: (
        productId: string,
        updates: Partial<Omit<IWishlistItem, "productId" | "addedAt">>,
      ) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, ...updates } : item,
          ),
        }));
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
