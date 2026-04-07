"use client";

import { Badge } from "../../ui/badge";
import { X } from "lucide-react";
import { MAX_PRICE } from "@/lib/filter-utils";

interface CategoryName {
  id: string;
  name: string;
}

interface FilterBadgeProps {
  label: string;
  onClear: () => void;
  ariaLabel: string;
  children?: React.ReactNode;
}

function FilterBadge({
  label,
  onClear,
  ariaLabel,
  children,
}: FilterBadgeProps) {
  return (
    <Badge className="gap-1" variant="secondary">
      {label}
      {children}
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center justify-center p-0.5 hover:bg-muted-foreground/20 rounded-full transition-colors"
        aria-label={ariaLabel}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </Badge>
  );
}

interface ActiveFilterBadgesProps {
  selectedCategory: string;
  priceRange: number[];
  inStock: boolean;
  minRating: number;
  categories: CategoryName[];
  onClearCategory: () => void;
  onClearPrice: () => void;
  onClearStock: () => void;
  onClearRating: () => void;
}

export function ActiveFilterBadges({
  selectedCategory,
  priceRange,
  inStock,
  minRating,
  categories,
  onClearCategory,
  onClearPrice,
  onClearStock,
  onClearRating,
}: ActiveFilterBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {selectedCategory && (
        <FilterBadge
          key="category"
          label={
            categories.find((category) => category.id === selectedCategory)
              ?.name || "Категория"
          }
          onClear={onClearCategory}
          ariaLabel="Убрать фильтр категории"
        />
      )}
      {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
        <FilterBadge
          key="price"
          label={`Цена: ${priceRange[0].toLocaleString()}-${priceRange[1].toLocaleString()} ₽`}
          onClear={onClearPrice}
          ariaLabel="Убрать фильтр цены"
        />
      )}
      {inStock && (
        <FilterBadge
          key="stock"
          label="В наличии"
          onClear={onClearStock}
          ariaLabel="Убрать фильтр наличия"
        />
      )}
      {minRating > 0 && (
        <FilterBadge
          key="rating"
          label={`Рейтинг: ${minRating} и выше`}
          onClear={onClearRating}
          ariaLabel="Убрать фильтр рейтинга"
        />
      )}
    </div>
  );
}
