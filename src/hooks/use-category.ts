import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Не удалось загрузить категории");
  return res.json();
}
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
