"use client";

import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { StarRating } from "../../shared/star-rating";

interface FilterRatingSectionProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export function FilterRatingSection({
  minRating,
  onRatingChange,
}: FilterRatingSectionProps) {
  return (
    <div className="space-y-2">
      {[4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center space-x-2">
          <Checkbox
            id={`rating-${rating}`}
            checked={minRating === rating}
            onCheckedChange={(checked) => {
              onRatingChange(checked ? rating : 0);
            }}
          />
          <Label
            htmlFor={`rating-${rating}`}
            className="text-sm font-normal cursor-pointer flex items-center gap-1"
          >
            <StarRating rating={rating} size="sm" />
            <span className="text-muted-foreground">
              {rating} и выше
            </span>
          </Label>
        </div>
      ))}
    </div>
  );
}
