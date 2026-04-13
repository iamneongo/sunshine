"use client";

import * as React from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type FilterOperator = "contains" | "is";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterFieldConfig = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: FilterOption[];
  placeholder?: string;
  defaultOperator?: FilterOperator;
};

export type Filter = {
  id: string;
  field: string;
  operator: FilterOperator;
  values: string[];
};

export function createFilter(field: string, operator: FilterOperator = "is", values: string[] = [""]): Filter {
  return {
    id: field,
    field,
    operator,
    values
  };
}

function findField(fields: FilterFieldConfig[], key: string) {
  return fields.find((field) => field.key === key) ?? null;
}

function getReadableValue(filter: Filter, fields: FilterFieldConfig[]) {
  const field = findField(fields, filter.field);
  const rawValue = filter.values[0] ?? "";

  if (!field || !rawValue) {
    return "Chưa chọn";
  }

  if (field.type === "select") {
    return field.options?.find((option) => option.value === rawValue)?.label ?? rawValue;
  }

  return rawValue;
}

function getFieldOptionLabel(field: FilterFieldConfig, value: string) {
  if (!value) {
    return `Chọn ${field.label.toLowerCase()}`;
  }

  if (field.type === "select") {
    return field.options?.find((option) => option.value === value)?.label ?? value;
  }

  return value;
}

export function Filters({
  filters,
  fields,
  onChange,
  className
}: {
  filters: Filter[];
  fields: FilterFieldConfig[];
  onChange: (filters: Filter[]) => void;
  className?: string;
}) {
  const availableFields = fields.filter((field) => !filters.some((filter) => filter.field === field.key));

  const addFilter = (fieldKey: string) => {
    const field = findField(fields, fieldKey);

    if (!field) {
      return;
    }

    const firstValue = field.type === "select" ? field.options?.[0]?.value ?? "" : "";

    onChange([
      ...filters,
      createFilter(field.key, field.defaultOperator ?? (field.type === "text" ? "contains" : "is"), [firstValue])
    ]);
  };

  const updateFilterValue = (filterId: string, nextValue: string) => {
    onChange(filters.map((filter) => (filter.id === filterId ? { ...filter, values: [nextValue] } : filter)));
  };

  const removeFilter = (filterId: string) => {
    onChange(filters.filter((filter) => filter.id !== filterId));
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const field = findField(fields, filter.field);

          if (!field) {
            return null;
          }

          return (
            <div
              key={filter.id}
              className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background px-3 py-2 shadow-sm"
            >
              <span className="text-muted-foreground text-xs uppercase tracking-[0.18em]">{field.label}</span>
              {field.type === "text" ? (
                <Input
                  value={filter.values[0] ?? ""}
                  onChange={(event) => updateFilterValue(filter.id, event.target.value)}
                  placeholder={field.placeholder ?? `Nhập ${field.label.toLowerCase()}`}
                  className="h-8 min-w-[180px] border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 min-w-[170px] justify-between rounded-xl border-border/70 bg-muted/40"
                    >
                      <span className="truncate">{getFieldOptionLabel(field, filter.values[0] ?? "")}</span>
                      <ChevronDown className="size-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[220px]">
                    <DropdownMenuRadioGroup
                      value={filter.values[0] ?? ""}
                      onValueChange={(value) => updateFilterValue(filter.id, value)}
                    >
                      {field.options?.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button type="button" variant="ghost" size="icon-xs" className="rounded-full" onClick={() => removeFilter(filter.id)}>
                <X className="size-3.5" />
                <span className="sr-only">Xóa bộ lọc</span>
              </Button>
            </div>
          );
        })}

        {availableFields.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 rounded-2xl border-dashed border-border/80 bg-background px-3 shadow-sm"
              >
                <Plus className="size-4" />
                Thêm bộ lọc
                <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              {availableFields.map((field) => (
                <DropdownMenuItem key={field.key} onClick={() => addFilter(field.key)}>
                  <Check className="size-4 opacity-0" />
                  {field.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {filters.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const field = findField(fields, filter.field);

            if (!field) {
              return null;
            }

            return (
              <span
                key={`${filter.id}-summary`}
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs text-muted-foreground"
              >
                <span className="font-medium text-foreground">{field.label}:</span>
                {getReadableValue(filter, fields)}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
