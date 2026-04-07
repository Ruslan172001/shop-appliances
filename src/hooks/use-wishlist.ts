import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IWishlistItem } from "@/types";
import { DEFAULT_STALE_TIME } from "@/lib/query-constants";
const QUERY_KEY = ["wishlist"] as const;

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function useWishlist() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      fetchApi<{ items: IWishlistItem[] }>("/api/wishlist").then(
        (data) => data.items,
      ),
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<IWishlistItem, "addedAt">) => {
      const previousItems =
        queryClient.getQueryData<IWishlistItem[]>(QUERY_KEY) || [];

      queryClient.setQueryData(QUERY_KEY, [
        ...previousItems,
        { ...item, addedAt: new Date() } as IWishlistItem,
      ]);

      try {
        return await fetchApi("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.productId }),
        });
      } catch (error) {
        queryClient.setQueryData(QUERY_KEY, previousItems);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const previousItems =
        queryClient.getQueryData<IWishlistItem[]>(QUERY_KEY) || [];

      queryClient.setQueryData(
        QUERY_KEY,
        previousItems.filter((i) => i.productId !== productId),
      );

      try {
        return await fetchApi("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } catch (error) {
        queryClient.setQueryData(QUERY_KEY, previousItems);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
