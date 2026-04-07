"use client";

import { Filter } from "lucide-react";
import { Button } from "@/styles/components/ui/button";
import { CatalogSortControls } from "./catalog-sort-controls";

interface CatalogToolbarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  totalItems: number;
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: string, order: string) => void;
}

export function CatalogToolbar({
  showFilters,
  onToggleFilters,
  totalItems,
  sortBy,
  sortOrder,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className="lg:hidden"
        aria-expanded={showFilters}
        aria-controls="catalog-filters"
        aria-label={showFilters ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
        Фильтры
      </Button>

      <span
        className="text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Найдено товаров: {totalItems}
      </span>

      <CatalogSortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
    </div>
  );
}
