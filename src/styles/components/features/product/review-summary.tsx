import { StarRating } from "../../shared/star-rating";

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export function ReviewSummary({
  averageRating,
  totalReviews,
}: ReviewSummaryProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div
        className="text-5xl font-bold"
        aria-label={`Средний рейтинг: ${averageRating.toFixed(1)} из 5`}
      >
        {averageRating.toFixed(1)}
      </div>
      <div>
        <StarRating rating={averageRating} size="lg" />
        <p className="text-muted-foreground" role="status" aria-live="polite">
          {totalReviews} отзывов
        </p>
      </div>
    </div>
  );
}
