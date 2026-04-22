import { Button } from "@/styles/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/styles/components/ui/select";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowCount?: number;
  isServerPagination?: boolean;
}

export function DataTablePagination<TData>({
  table,
  rowCount,
  isServerPagination = false,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = rowCount ?? table.getFilteredRowModel().rows.length;
  const totalPages = isServerPagination
    ? table.getPageCount()
    : Math.ceil(totalRows / pageSize);

  return (
    <div
      className="flex items-center justify-between px-2 flex-wrap gap-4"
      role="navigation"
      aria-label="Пагинация таблицы"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Строк на странице:
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger
            className="h-8 w-17.5"
            aria-label="Выбрать количество строк"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-muted-foreground">
        {totalRows > 0 ? (
          <>
            Страница {currentPage} из {totalPages}
            {"·"}
            Показано {(currentPage - 1) * pageSize + 1}=
            {Math.min(currentPage * pageSize, totalRows)} из {totalRows}
          </>
        ) : (
          "Нет данных"
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="Первая страница"
          aria-disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Предыдущая страница"
          aria-disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Следующая страница"
          aria-disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Последняя страница"
          aria-disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
