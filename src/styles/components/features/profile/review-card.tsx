import { Card, CardContent, CardHeader } from "../../ui/card";
import { StarRating } from "../../shared/star-rating";
import { formatDate } from "@/styles/lib/user-utils";
import Link from "next/link";
import { IReviewWithProduct } from "@/types";

interface ReviewCardProps {
  review: IReviewWithProduct;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            href={`/product/${review.product.slug}`}
            className="font-medium hover:underline"
          >
            {review.product.name}
          </Link>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </CardHeader>
      <CardContent>
        {review.comment && (
          <p className="text-muted-foreground">{review.comment}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {formatDate(review.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}
