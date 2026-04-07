import { Card, CardContent, CardHeader } from "../card";
import { Skeleton } from "../skeleton";

export function SkeletonReview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {/* Аватар */}
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            {/* Имя */}
            <Skeleton className="h-4 w-24" />
            {/* Рейтинг */}
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        {/* Дата */}
        <Skeleton className="h-3 w-16" />
      </CardHeader>
      <CardContent>
        {/* Текст отзыва */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}
