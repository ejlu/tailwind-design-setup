import { Tabs as R } from "radix-ui";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/cn";
export const Tabs = R.Root;
export function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof R.List>) {
  return (
    <R.List {...props} className={cn("flex flex-wrap gap-1 border-b border-border", className)} />
  );
}
export function TabsTrigger({ className, ...props }: ComponentPropsWithoutRef<typeof R.Trigger>) {
  return (
    <R.Trigger
      {...props}
      className={cn(
        "focus-ring type-label min-h-control border-b-2 border-transparent px-control-px text-muted hover:bg-hover data-[state=active]:border-selection-border data-[state=active]:text-on-selected",
        className,
      )}
    />
  );
}
export function TabsContent({ className, ...props }: ComponentPropsWithoutRef<typeof R.Content>) {
  return <R.Content {...props} className={cn("focus-ring pt-6", className)} />;
}
