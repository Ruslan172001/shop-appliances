import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

export function StarRating({
  rating,
  size = "md",
  className,
  ariaLabel,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={ariaLabel || `Рейтинг: ${rating} из 5 звезд`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            sizeClasses[size],
            i < Math.floor(rating) ? "fill-yellow-500" : "text-gray-300",
          )}
        />
      ))}
    </div>
  );
}
