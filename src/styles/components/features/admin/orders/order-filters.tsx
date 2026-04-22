"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/styles/components/ui/select";
import { Label } from "@/styles/components/ui/label";
import { orderStatusLabels } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

interface OrderFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}
export function OrderFilters({
  selectedStatus,
  onStatusChange,
}: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-muted-foreground whitespace-nowrap">
        Статус:
      </Label>
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-50 h-8" aria-label="Фильтр по статусу">
          <SelectValue placeholder="Все статусы" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          {Object.entries(orderStatusLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
