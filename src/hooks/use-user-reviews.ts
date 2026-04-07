import { useQuery } from "@tanstack/react-query";
import { IReviewWithProduct } from "@/types";
import { DEFAULT_STALE_TIME } from "@/lib/query-constants";
async function fetchUserReviews(): Promise<IReviewWithProduct[]> {
  const res = await fetch("/api/user/reviews");
  if (!res.ok) throw new Error("Не удалось загрузить отзывы");
  return res.json();
}
export function useUserReviews() {
  return useQuery({
    queryKey: ["user-reviews"],
    queryFn: fetchUserReviews,
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}
