import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ICartItem } from "@/types";
import { DEFAULT_STALE_TIME } from "@/lib/query-constants";
const QUERY_KEY = ["cart"] as const;

async function fetchCart(): Promise<ICartItem[]> {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Не удалось загрузить корзину");
  const data: { items: ICartItem[] } = await res.json();
  return data.items;
}

export function useCart() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchCart,
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      item,
      quantity = 1,
    }: {
      item: Omit<ICartItem, "quantity">;
      quantity?: number;
    }) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, quantity }),
      });
      if (!res.ok) throw new Error("Ошибка при добавлении в корзину");
      return res.json();
    },
    onMutate: async ({ item, quantity = 1 }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<ICartItem[]>(QUERY_KEY) || [];

      const existingIndex = previousItems.findIndex(
        (i) => i.productId === item.productId,
      );

      let newItems: ICartItem[];
      if (existingIndex !== -1) {
        newItems = [...previousItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
      } else {
        newItems = [...previousItems, { ...item, quantity }];
      }

      queryClient.setQueryData(QUERY_KEY, newItems);
      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Ошибка при удалении из корзины");
      return res.json();
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<ICartItem[]>(QUERY_KEY) || [];

      queryClient.setQueryData(
        QUERY_KEY,
        previousItems.filter((i) => i.productId !== productId),
      );

      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error("Ошибка при обновлении корзины");
      return res.json();
    },
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<ICartItem[]>(QUERY_KEY) || [];

      if (quantity <= 0) {
        queryClient.setQueryData(
          QUERY_KEY,
          previousItems.filter((i) => i.productId !== productId),
        );
      } else {
        queryClient.setQueryData(
          QUERY_KEY,
          previousItems.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        );
      }

      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Ошибка при очистке корзины");
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<ICartItem[]>(QUERY_KEY) || [];

      queryClient.setQueryData(QUERY_KEY, []);
      return { previousItems };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
