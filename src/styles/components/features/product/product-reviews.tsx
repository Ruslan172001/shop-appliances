"use client";
import { useActionState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { StarRating } from "../../shared/star-rating";
import { submitReview, ReviewFormState, deleteReview } from "@/actions/review";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { StarRatingInput } from "../../shared/star-rating-input";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
  const [state, formAction, isPending] = useActionState(
    submitReview,
    {} as ReviewFormState,
  );

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId, productId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Отзыв удален");
  };
  const success = state?.success;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Отзывы ({totalReviews})</h2>

      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
        <div>
          <StarRating rating={averageRating} size="lg" />
          <p className="text-muted-foreground">{totalReviews} отзывов</p>
        </div>
      </div>

      {session ? (
        <div className="space-y-3">
          <h3 className="font-semibold">Оставить отзыв</h3>

          {success ? (
            <div className="p-4 text-sm text-green-700 bg-green-50 rounded-lg">
              Спасибо! Ваш отзыв отправлен.
            </div>
          ) : (
            <form action={formAction}>
              <input type="hidden" name="productId" value={productId} />
              <StarRatingInput />
              <Textarea
                name="comment"
                placeholder="Напишите ваш отзыв..."
                rows={4}
                className="mt-3"
              />
              {state?.error && (
                <p className="text-sm text-destructive mt-2">{state.error}</p>
              )}
              <Button type="submit" className="mt-3" disabled={isPending}>
                {isPending ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          )}
        </div>
      ) : (
        <div className="p-4 text-sm text-muted-foreground bg-muted/50 rounded-lg">
          <Link href="/login" className="underline hover:text-foreground">
            Войдите
          </Link>
          , чтобы оставить отзыв
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">Отзывов пока нет</p>
        ) : (
          reviews.map((review) => (
            <div className="border rounded-lg p-4 space-y-2" key={review.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {review.user.name || "Аноним"}
                  </span>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                  {session?.user?.id === review.userId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
