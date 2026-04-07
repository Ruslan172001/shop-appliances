import { Skeleton } from "@/styles/components/ui/skeleton";
import { Separator } from "@/styles/components/ui/separator";

export default function ProductLoading() {
  return (
    <div className="container mx-auto py-8">
      {/* Хлебные крошки */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Основная сетка продукта */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Галерея */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>

        {/* Информация о продукте */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />

          <div className="space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
          </div>

          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Спецификации */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between py-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Отзывы */}
      <div className="space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
