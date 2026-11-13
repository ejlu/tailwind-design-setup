import {
  createContext,
  cloneElement,
  useContext,
  useId,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type ReactElement,
  type AriaAttributes,
} from "react";
import { cn } from "../lib/cn";
const Context = createContext<{ id: string; describedBy?: string; invalid: boolean } | null>(null);
function useField() {
  const field = useContext(Context);
  if (!field) throw new Error("FieldLabel and FieldControl require Field.");
  return field;
}
export function Field({
  id,
  label,
  description,
  error,
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  const generated = useId();
  const controlId = id ?? generated;
  const describedBy =
    [description && `${controlId}-description`, error && `${controlId}-error`]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <Context.Provider value={{ id: controlId, describedBy, invalid: !!error }}>
      <div {...props} className={cn("flex min-w-0 flex-col gap-2", className)}>
        <FieldLabel>{label}</FieldLabel>
        {children}
        {description && (
          <p id={`${controlId}-description`} className="type-caption text-muted">
            {description}
          </p>
        )}
        {error && (
          <p id={`${controlId}-error`} className="type-caption text-danger-text">
            {error}
          </p>
        )}
      </div>
    </Context.Provider>
  );
}
export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  const field = useField();
  return <label {...props} htmlFor={field.id} className={cn("type-label", className)} />;
}
/** The pattern owns the association and preserves a control's extra descriptions. */
export function FieldControl({
  children,
}: {
  children: ReactElement<AriaAttributes & { id?: string }>;
}) {
  const field = useField();
  return cloneElement(children, {
    id: field.id,
    "aria-describedby":
      [children.props["aria-describedby"], field.describedBy].filter(Boolean).join(" ") ||
      undefined,
    "aria-invalid": field.invalid || children.props["aria-invalid"] || undefined,
  });
}
