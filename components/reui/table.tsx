import * as React from "react";
import { cn } from "@/lib/utils";

export function ReUITableShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("overflow-hidden rounded-[1.35rem] border border-border/70 bg-background shadow-sm", className)}
      {...props}
    />
  );
}

export function ReUITableToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-3 border-b border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", className)}
      {...props}
    />
  );
}

export function ReUITableScroll({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("max-h-[72vh] overflow-auto", className)} {...props} />;
}
