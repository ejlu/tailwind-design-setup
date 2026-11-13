import { Dialog as D, DropdownMenu as M, Tooltip as T } from "radix-ui";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/cn";
import { IconButton } from "./button";
import { PortalScope, usePortalContainer } from "./theme";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogTitle = ({ className, ...props }: ComponentPropsWithoutRef<typeof D.Title>) => (
  <D.Title {...props} className={cn("type-title", className)} />
);
export const DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof D.Description>) => (
  <D.Description {...props} className={cn("type-body text-muted", className)} />
);
export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof D.Content>) {
  const container = usePortalContainer();
  if (!container) return null;
  return (
    <D.Portal container={container}>
      <D.Overlay data-ui-dialog-overlay="" className="fixed inset-0 z-40 bg-blanket" />
      <D.Content
        {...props}
        className={cn(
          "fixed inset-0 z-50 m-auto h-fit max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-panel border border-border bg-overlay p-6 text-fg shadow-overlay",
          className,
        )}
      >
        <PortalScope>
          <div className="pe-10">{children}</div>
        </PortalScope>
        <D.Close asChild>
          <IconButton label="Close dialog" className="absolute end-3 top-3">
            <X aria-hidden="true" />
          </IconButton>
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
export const Menu = M.Root;
export const MenuTrigger = M.Trigger;
export function MenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof M.Content>) {
  const container = usePortalContainer();
  if (!container) return null;
  return (
    <M.Portal container={container}>
      <M.Content
        {...props}
        sideOffset={sideOffset}
        className={cn(
          "z-[60] max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-44 overflow-y-auto rounded-control border border-border bg-overlay p-1 text-fg shadow-overlay",
          className,
        )}
      />
    </M.Portal>
  );
}
export function MenuItem({ className, ...props }: ComponentPropsWithoutRef<typeof M.Item>) {
  return (
    <M.Item
      {...props}
      className={cn(
        "type-body flex min-h-control cursor-default items-center gap-2 rounded-control px-control-px outline-none data-[highlighted]:outline-hidden data-[highlighted]:bg-selected data-[highlighted]:text-on-selected data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4",
        className,
      )}
    />
  );
}
export const TooltipProvider = T.Provider;
export const Tooltip = T.Root;
export const TooltipTrigger = T.Trigger;
export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof T.Content>) {
  const container = usePortalContainer();
  if (!container) return null;
  return (
    <T.Portal container={container}>
      <T.Content
        {...props}
        sideOffset={sideOffset}
        className={cn(
          "type-caption z-[70] max-w-64 rounded-control border border-border bg-overlay px-3 py-2 text-fg shadow-overlay",
          className,
        )}
      />
    </T.Portal>
  );
}
