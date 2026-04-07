import { Card, CardContent } from "../card";
import { Skeleton } from "../skeleton";

export function SkeletonCartItem() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Изображение */}
          <Skeleton className="aspect-square w-20 h-20 rounded-md shrink-0" />

          <div className="flex-1 min-w-0">
            {/* Название */}
            <Skeleton className="h-4 w-3/4 mb-2" />

            {/* Цена */}
            <Skeleton className="h-4 w-20 mb-2" />

            {/* Количество и кнопка удаления */}
            <div className="flex items-center justify-between mt-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
