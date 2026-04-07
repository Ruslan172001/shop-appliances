"use client";

import { ReviewCard } from "./review-card";

interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  user: {
    id: string;
    name: string | null;
  };
  createdAt: Date;
}

interface ReviewListProps {
  reviews: ReviewWithUser[];
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
