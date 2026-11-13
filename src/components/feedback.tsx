import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";
const tones: Record<Tone, string> = {
  neutral: "bg-sunken text-fg",
  success: "bg-success-soft text-success-text",
  warning: "bg-warning-soft text-warning-text",
  danger: "bg-danger-soft text-danger-text",
  info: "bg-info-soft text-info-text",
};
export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      {...props}
      className={cn(
        "type-caption inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium",
        tones[tone],
        className,
      )}
    />
  );
}
export function Alert({
  tone = "info",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      {...props}
      role={props.role ?? "status"}
      className={cn("type-body rounded-control p-4", tones[tone], className)}
    />
  );
}
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("rounded-panel border border-border bg-surface p-5 shadow-raised", className)}
    />
  );
}
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn("animate-pulse rounded-control bg-border", className)}
    />
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="type-heading">{title}</p>
      {description && <p className="type-body text-muted">{description}</p>}
      {action}
    </div>
  );
}
