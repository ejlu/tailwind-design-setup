import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table {...props} className={cn("type-body w-full border-collapse text-start", className)} />
    </div>
  );
}
export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={cn(
        "border-b border-border hover:bg-hover data-[selected=true]:bg-selected data-[selected=true]:text-on-selected data-[selected=true]:hover:bg-selected",
        className,
      )}
    />
  );
}
export function TableHead({
  className,
  scope = "col",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      scope={scope}
      className={cn(
        "type-caption whitespace-nowrap bg-sunken px-4 py-row text-start font-semibold text-muted",
        className,
      )}
    />
  );
}
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn("px-4 py-row align-middle", className)} />;
}
