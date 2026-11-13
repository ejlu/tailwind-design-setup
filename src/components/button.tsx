import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export const buttonVariants = cva(
  "focus-ring type-label inline-flex min-h-control shrink-0 items-center justify-center gap-control-gap rounded-control px-control-px transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-action text-on-action hover:bg-action-hover active:bg-action-hover",
        secondary: "border border-input-border bg-surface text-fg hover:bg-hover active:bg-pressed",
        ghost: "text-fg hover:bg-hover active:bg-pressed",
        danger: "bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-hover",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, className, loading = false, disabled, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant }), className)}
    >
      {loading && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {children}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "aria-label"> {
  label: string;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, variant = "ghost", ...props },
  ref,
) {
  return (
    <Button
      {...props}
      ref={ref}
      variant={variant}
      aria-label={label}
      className={cn("size-control p-0", className)}
    />
  );
});
