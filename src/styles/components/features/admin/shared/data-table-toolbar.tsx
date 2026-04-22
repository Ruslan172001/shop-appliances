import { Input } from "@/styles/components/ui/input";
import { Search } from "lucide-react";

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}
export function DataTableToolbar({
  searchPlaceholder = "Поиск...",
  searchValue = "",
  onSearchChange,
  filters,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {onSearchChange && (
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="seacrh"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            aria-label={searchPlaceholder}
          />
        </div>
      )}
      {filters && <div className="flex items-center gap-2">{filters}</div>}
      {actions && (
        <div className="flex items-center gap-2 ml-auto">{actions}</div>
      )}
    </div>
  );
}
