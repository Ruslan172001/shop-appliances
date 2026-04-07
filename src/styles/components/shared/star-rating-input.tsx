import { Star } from "lucide-react";
import { useState } from "react";

export function StarRatingInput() {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(5);
  return (
    <div className="flex gap-1">
      <input type="hidden" name="rating" value={selected} />
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          type="button"
          onClick={() => setSelected(val)}
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
          />
        </button>
      ))}
    </div>
  );
}
