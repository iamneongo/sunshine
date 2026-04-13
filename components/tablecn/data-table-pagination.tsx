"use client";

import type { Table as TanStackTable } from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DataTablePaginationProps<TData> = {
  table: TanStackTable<TData>;
  pageSizeOptions?: number[];
  className?: string;
};

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50],
  className
}: DataTablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = Math.max(table.getPageCount(), 1);
  const pageSize = table.getState().pagination.pageSize;
  const start = totalRows === 0 ? 0 : table.getState().pagination.pageIndex * pageSize + 1;
  const end = totalRows === 0 ? 0 : Math.min(start + pageSize - 1, totalRows);

  return (
    <div className={cn("flex flex-col gap-3 border-t border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="text-muted-foreground text-sm">
        Hiển thị {start}-{end} trên tổng {totalRows} lead
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">Mỗi trang</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="w-[88px] justify-between rounded-xl">
                {pageSize}
                <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[88px]">
              <DropdownMenuRadioGroup value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                {pageSizeOptions.map((option) => (
                  <DropdownMenuRadioItem key={option} value={`${option}`}>
                    {option}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-muted-foreground text-sm">
          Trang {currentPage}/{pageCount}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-xl"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-xl"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
