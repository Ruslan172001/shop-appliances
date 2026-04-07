"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/styles/components/ui/pagination";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  // Генерация массива страниц с ellipsis
  const generatePageNumbers = (): (number | -1)[] => {
    const delta = 2;
    const range = [
      1,
      currentPage - delta,
      currentPage,
      currentPage + delta,
      totalPages,
    ];

    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => range.includes(page))
      .reduce<number[]>((acc, page, idx, arr) => {
        if (idx === 0) return [page];
        if (page - arr[idx - 1] === 1) return [...acc, page];
        if (page - arr[idx - 1] === 2) return [...acc, page - 1, page];
        return [...acc, -1, page];
      }, []) as (number | -1)[];
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((page, idx) =>
          page === -1 ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <span
                className="flex size-8 items-center justify-center"
                aria-hidden="true"
              >
                ...
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
