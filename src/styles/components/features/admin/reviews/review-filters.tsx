"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/styles/components/ui/select";
import { Label } from "@/styles/components/ui/label";

interface ReviewFiltersProps {
  selectedRating: string;
  onRatingChange: (rating: string) => void;
}

export function ReviewFilters({
  selectedRating,
  onRatingChange,
}: ReviewFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-muted-foreground whitespace-nowrap">
        Оценка:
      </Label>
      <Select value={selectedRating} onValueChange={onRatingChange}>
        <SelectTrigger className="w-44 h-8" aria-label="Фильтр по оценке">
            <SelectValue placeholder="Все оценки"/>
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="all">Все оценки</SelectItem>
        {[5,4,3,2,1].map((n)=>(
            <SelectItem key={n} value={String(n)}>
                {n} {n === 1 ? "звезда": n < 5 ? "звезды" :"звёзд"}
            </SelectItem>
        ))}
        </SelectContent>
      </Select>
    </div>
  );
}
