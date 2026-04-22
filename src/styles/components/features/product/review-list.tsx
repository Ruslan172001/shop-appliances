"use client";

import { ReviewCard } from "./review-card";
import type { IReview } from "@/types";
export interface IReviewWithUser extends IReview {
  user: {
    id: string;
    name: string | null;
  };
}
interface ReviewListProps {
  reviews: IReviewWithUser[];
  currentUserId?: string;
  onDelete: (reviewId: string) => void;
}

export function ReviewList({
  reviews,
  currentUserId,
  onDelete,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground">Отзывов пока нет</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          isOwner={currentUserId === review.userId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
