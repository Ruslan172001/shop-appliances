"use client";

import { Button } from "../../ui/button";
import { StarRating } from "../../shared/star-rating";
import { Trash2 } from "lucide-react";
import type { IReview } from "types";
interface ReviewCardProps {
  review: IReview;
  isOwner: boolean;
  onDelete: (reviewId: string) => void;
}

export function ReviewCard({ review, isOwner, onDelete }: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{review.user.name || "Аноним"}</span>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <time className="text-sm text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString("ru-RU")}
          </time>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(review.id)}
              aria-label={`Удалить отзыв от ${review.user.name || "Аноним"}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="text-muted-foreground">{review.comment}</p>
      )}
    </div>
  );
}
