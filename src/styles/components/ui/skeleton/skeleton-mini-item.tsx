import { Skeleton } from "../skeleton";

export function SkeletonMiniItem() {
  return (
    <div className="flex gap-3 p-2">
      {/* Изображение */}
      <Skeleton className="w-16 h-16 rounded-md shrink-0" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
