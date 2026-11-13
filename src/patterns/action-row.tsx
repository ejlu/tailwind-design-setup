import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
export function ActionRow({
  leading,
  title,
  description,
  trailing,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  trailing: ReactNode;
}) {
  return (
    <div
      {...props}
      className={cn("flex flex-wrap items-center gap-4 py-row sm:flex-nowrap", className)}
    >
      {leading && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-sunken text-muted [&_svg]:size-5">
          {leading}
        </div>
      )}
      <div className="min-w-0 flex-1 break-words">
        <div className="type-label">{title}</div>
        {description && <div className="type-caption mt-1 text-muted">{description}</div>}
      </div>
      <div className="flex basis-full shrink-0 justify-end sm:basis-auto">{trailing}</div>
    </div>
  );
}
