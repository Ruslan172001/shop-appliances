"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/styles/components/ui/select";
import { Label } from "@/styles/components/ui/label";

interface PromoCodeFiltersProps {
  selectedActive: string;
  onActiveChange: (value: string) => void;
}

export function PromoCodeFilters({
  selectedActive,
  onActiveChange,
}: PromoCodeFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-muted-foreground whitespace-nowrap">
        Статус:
      </Label>
      <Select value={selectedActive} onValueChange={onActiveChange}>
        <SelectTrigger className="w-44 h-8" aria-label="Фильтр по активности">
          <SelectValue placeholder="Все" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все</SelectItem>
          <SelectItem value="true">Активные</SelectItem>
          <SelectItem value="false">Неактивные</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
