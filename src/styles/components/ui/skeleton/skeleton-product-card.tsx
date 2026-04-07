import { Card, CardContent, CardFooter } from "../card";
import { Skeleton } from "../skeleton";

export function SkeletonProductCard() {
  return (
    <Card className="group flex flex-col h-full overflow-hidden">
      <Skeleton className="aspect-square rounded-t-lg" />

      <CardContent className="flex-1 p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-3" />

        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-2" />

        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}
