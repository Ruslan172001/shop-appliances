"use client";
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/styles/components/ui/table";
import { Skeleton } from "@/styles/components/ui/skeleton";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  rowCount?: number;
  pageCount?: number;
  externalPagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  onRowClick?: (row: TData) => void;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Поиск...",
  onSearchChange,
  searchValue = "",
  filters,
  actions,
  rowCount,
  pageCount = -1,
  externalPagination,
  onPaginationChange,
  onRowClick,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>(
    externalPagination || { pageIndex: 0, pageSize: 10 },
  );

  const isServerPagination = pageCount !== -1;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(isServerPagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          manualPagination: true,
          pageCount,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          manualPagination: false,
        }),
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    state: {
      sorting,
      pagination: externalPagination || pagination,
    },
  });

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Toolbar */}
      {(onSearchChange || filters || actions) && (
        <DataTableToolbar
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={filters}
          actions={actions}
        />
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table role="table" aria-label="Таблица данных">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        rowCount={rowCount}
        isServerPagination={isServerPagination}
      />
    </div>
  );
}
