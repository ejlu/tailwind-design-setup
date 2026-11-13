import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Switch as RadixSwitch } from "radix-ui";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { cn } from "../lib/cn";

const control =
  "focus-ring type-body min-h-control w-full rounded-control border border-input-border bg-surface px-control-px text-fg placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-text";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input {...props} ref={ref} className={cn(control, className)} />;
  },
);
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 3, ...props }, ref) {
  return <textarea {...props} ref={ref} rows={rows} className={cn(control, "py-2", className)} />;
});
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select {...props} ref={ref} className={cn(control, className)} />;
  },
);
export const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function Checkbox({ className, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      className={cn(
        "focus-ring size-6 shrink-0 accent-selection-border disabled:opacity-50",
        className,
      )}
    />
  );
});
export const Radio = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function Radio({ className, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="radio"
      className={cn(
        "focus-ring size-6 shrink-0 accent-selection-border disabled:opacity-50",
        className,
      )}
    />
  );
});
export const Switch = forwardRef<
  ComponentRef<typeof RadixSwitch.Root>,
  ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <span className="switch-host">
      <RadixSwitch.Root
        {...props}
        ref={ref}
        className={cn(
          "focus-ring inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-input-border bg-sunken px-1 data-[state=checked]:bg-selection-border data-[state=checked]:border-selection-border disabled:opacity-50",
          className,
        )}
      >
        <RadixSwitch.Thumb className="block size-5 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-on-selection-border rtl:data-[state=checked]:-translate-x-5" />
      </RadixSwitch.Root>
    </span>
  );
});
