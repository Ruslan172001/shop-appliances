"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteReview } from "@/actions/review";
import { ReviewSummary } from "./review-summary";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";

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

interface ProductReviewsProps {
  productId: string;
  reviews: ReviewWithUser[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const { data: session } = useSession();

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId, productId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Отзыв удален");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Отзывы ({totalReviews})</h2>

      <ReviewSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
      />

      {session ? (
        <div className="space-y-3">
          <h3 className="font-semibold">Оставить отзыв</h3>
          <ReviewForm productId={productId} />
        </div>
      ) : (
        <div className="p-4 text-sm text-muted-foreground bg-muted/50 rounded-lg">
          <Link href="/login" className="underline hover:text-foreground">
            Войдите
          </Link>
          , чтобы оставить отзыв
        </div>
      )}

      <ReviewList
        reviews={reviews}
        currentUserId={session?.user?.id}
        onDelete={handleDelete}
      />
    </div>
  );
}
