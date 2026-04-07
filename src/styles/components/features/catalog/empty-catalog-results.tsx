"use client";

import { Button } from "@/styles/components/ui/button";

interface EmptyCatalogResultsProps {
  onReset: () => void;
}

export function EmptyCatalogResults({ onReset }: EmptyCatalogResultsProps) {
  return (
    <div className="flex items-center justify-center min-h-100">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Товары не найдены</p>
        <Button variant="outline" onClick={onReset}>
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
}
