import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/reui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  title: string;
  value: ReactNode;
  icon?: LucideIcon;
  iconToneClass?: string;
  badge?: string;
  badgeVariant?: BadgeProps["variant"];
  note?: ReactNode;
  href?: string;
  hrefLabel?: string;
  className?: string;
  valueClassName?: string;
};

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  iconToneClass = "bg-primary/10 text-primary",
  badge,
  badgeVariant = "primary-light",
  note,
  href,
  hrefLabel = "Mở chi tiết",
  className,
  valueClassName
}: DashboardStatCardProps) {
  const hasFooter = Boolean(note || href);

  return (
    <Card className={cn("border-border/80 shadow-sm", className)}>
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
          {Icon ? (
            <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", iconToneClass)}>
              <Icon className="size-5" />
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={cn("text-foreground text-3xl font-medium tracking-tight tabular-nums", valueClassName)}>{value}</span>
            {badge ? (
              <Badge variant={badgeVariant} radius="full">
                {badge}
              </Badge>
            ) : null}
          </div>

          {hasFooter ? (
            <>
              <Separator />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {note ? <div className="text-muted-foreground text-xs leading-5">{note}</div> : <div />}
                {href ? (
                  <Button asChild variant="ghost" size="sm" className="-ml-2 h-auto px-2 py-1">
                    <Link href={href}>
                      {hrefLabel}
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
