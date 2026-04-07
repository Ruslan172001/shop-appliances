"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";

interface CatalogSortControlsProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: string, order: string) => void;
}

export function CatalogSortControls({
  sortBy,
  sortOrder,
  onSortChange,
}: CatalogSortControlsProps) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <span id="sort-by-label" className="text-sm text-muted-foreground">
        Сортировать:
      </span>
      <Select
        value={sortBy}
        onValueChange={(v) => onSortChange(v, sortOrder)}
        aria-labelledby="sort-by-label"
      >
        <SelectTrigger className="w-45" aria-label="Выбор поля сортировки">
          <SelectValue placeholder="По умолчанию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">По дате</SelectItem>
          <SelectItem value="price">По цене</SelectItem>
          <SelectItem value="rating">По рейтингу</SelectItem>
          <SelectItem value="name">По названию</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortOrder}
        onValueChange={(v) => onSortChange(sortBy, v)}
        aria-labelledby="sort-by-label"
      >
        <SelectTrigger className="w-35" aria-label="Выбор порядка сортировки">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">По убыванию</SelectItem>
          <SelectItem value="asc">По возрастанию</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
