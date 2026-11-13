import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
export function Section({
  title,
  description,
  level = 2,
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
}) {
  const titleId = useId();
  const Heading = `h${level}` as const;
  return (
    <section {...props} aria-labelledby={titleId} className={cn("space-y-group", className)}>
      <header>
        <Heading id={titleId} className="type-heading">
          {title}
        </Heading>
        {description && <p className="type-body mt-1 text-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}
