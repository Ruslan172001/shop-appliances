"use client";
import { MessageSquare } from "lucide-react";
import type { IReviewWithProduct } from "@/types";
import { useUserReviews } from "@/hooks/use-user-reviews";
import ReviewCard from "./review-card";
import { SkeletonReview } from "../../ui/skeleton/skeleton-review";

export default function ReviewList() {
  const { data: reviews = [], isLoading } = useUserReviews();
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonReview key={i} />
        ))}
      </div>
    );
  }
  if (!reviews.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-12 text-center space-y-4">
        <MessageSquare className="h-16 w-16 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">У вас пока нет отзывов</p>
          <p className="text-muted-foreground">
            Оставьте первый отзыв в каталоге
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {reviews.map((review: IReviewWithProduct) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
