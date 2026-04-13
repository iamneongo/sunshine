"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EMPTY_OPTION_VALUE = "__empty__";

type DashboardFormSelectOption = {
  value: string;
  label: string;
};

type DashboardFormSelectProps = {
  name: string;
  defaultValue?: string;
  options: DashboardFormSelectOption[];
  placeholder?: string;
  emptyOptionLabel?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "default";
};

export function DashboardFormSelect({
  name,
  defaultValue = "",
  options,
  placeholder,
  emptyOptionLabel,
  triggerClassName,
  contentClassName,
  size = "default"
}: DashboardFormSelectProps) {
  const initialValue = React.useMemo(() => {
    if (!defaultValue && emptyOptionLabel) {
      return EMPTY_OPTION_VALUE;
    }

    return defaultValue;
  }, [defaultValue, emptyOptionLabel]);

  const [value, setValue] = React.useState(initialValue);
  const submittedValue = value === EMPTY_OPTION_VALUE ? "" : value;

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      <input type="hidden" name={name} value={submittedValue} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger size={size} className={cn("w-full", triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {emptyOptionLabel ? <SelectItem value={EMPTY_OPTION_VALUE}>{emptyOptionLabel}</SelectItem> : null}
          {options.map((option) => (
            <SelectItem key={`${name}-${option.value}`} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
