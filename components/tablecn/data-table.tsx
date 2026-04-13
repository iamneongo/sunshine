"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

export type DataTableColumnMeta = {
  label?: string;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  scrollClassName?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  showViewOptions?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  emptyMessage = "Không có dữ liệu phù hợp.",
  className,
  scrollClassName,
  pageSizeOptions = [10, 20, 50],
  initialPageSize = 10,
  showViewOptions = true
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  React.useEffect(() => {
    setPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, [data.length]);

  return (
    <div className={cn("overflow-hidden rounded-[1.5rem] border border-border/70 bg-background shadow-sm", className)}>
      {(toolbar || showViewOptions) && (
        <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">{toolbar}</div>
          {showViewOptions ? <DataTableViewOptions table={table} /> : null}
        </div>
      )}

      <div className={cn("max-h-[72vh] overflow-auto", scrollClassName)}>
        <Table>
          <TableHeader className="[&_tr]:border-b [&_tr]:border-border/70">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const meta = (header.column.columnDef.meta ?? {}) as DataTableColumnMeta;

                  return (
                    <TableHead key={header.id} className={cn("sticky top-0 z-10 h-12 bg-background py-3 text-xs font-semibold tracking-[0.18em] uppercase", meta.headerClassName)}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const meta = (cell.column.columnDef.meta ?? {}) as DataTableColumnMeta;

                    return (
                      <TableCell key={cell.id} className={cn("align-top whitespace-normal py-4", meta.cellClassName)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  );
}
