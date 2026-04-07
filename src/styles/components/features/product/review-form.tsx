"use client";

import { useActionState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { submitReview, ReviewFormState } from "@/actions/review";
import { StarRatingInput } from "../../shared/star-rating-input";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitReview,
    {} as ReviewFormState,
  );

  const success = state?.success;

  if (success) {
    return (
      <div className="p-4 text-sm text-green-700 bg-green-50 rounded-lg" role="status">
        Спасибо! Ваш отзыв отправлен.
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <StarRatingInput />
      <Textarea
        name="comment"
        placeholder="Напишите ваш отзыв..."
        rows={4}
        className="mt-3"
        aria-label="Текст отзыва"
      />
      {state?.error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" className="mt-3" disabled={isPending}>
        {isPending ? "Отправка..." : "Отправить"}
      </Button>
    </form>
  );
}
