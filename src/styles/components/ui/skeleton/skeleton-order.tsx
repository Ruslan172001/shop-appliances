import { Card, CardContent, CardHeader } from "../card";
import { Skeleton } from "../skeleton";

export function SkeletonOrder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Номер заказа */}
          <Skeleton className="h-5 w-32" />
          {/* Статус */}
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Мета-информация: дата, сумма, кол-во */}
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Превью товаров */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}
