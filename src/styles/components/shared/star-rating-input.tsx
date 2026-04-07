import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingInputProps {
  name?: string;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

export function StarRatingInput({
  name = "rating",
  initialRating = 0,
  onRatingChange,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);

  const handleRatingChange = (val: number) => {
    setSelected(val);
    onRatingChange?.(val);
  };

  return (
    <div className="flex gap-1" role="group" aria-label="Поставьте оценку">
      <input type="hidden" name={name} value={selected} />
      <span className="sr-only" aria-live="polite">
        Выбрано: {selected || 0} из 5
      </span>
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          type="button"
          aria-label={`${val} из 5 звёзд`}
          aria-pressed={val <= selected}
          onClick={() => handleRatingChange(val)}
          onMouseEnter={() => setHovered(val)}
          onMouseLeave={() => setHovered(0)}
          className="p-0 m-0 bg-transparent border-0 cursor-pointer"
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              val <= (hovered || selected)
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
