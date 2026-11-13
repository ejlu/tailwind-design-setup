import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react";
import { Direction } from "radix-ui";
import { cn } from "../lib/cn";

export type Theme = "warm" | "crisp";
export type Mode = "light" | "dark";
export type Density = "comfortable" | "compact";
export type TextDirection = "ltr" | "rtl";

type Scope = {
  theme: Theme;
  mode: Mode;
  density: Density;
  dir: TextDirection;
  container: HTMLElement | null;
};
const ThemeContext = createContext<Scope | null>(null);

export interface ThemeScopeProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  theme?: Theme;
  mode?: Mode;
  density?: Density;
  dir?: TextDirection;
}

/** Nested scopes inherit settings; overlays render inside the same CSS scope. */
export function ThemeScope({
  theme,
  mode,
  density,
  dir,
  children,
  className,
  ...props
}: ThemeScopeProps) {
  const parent = useContext(ThemeContext);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const value: Scope = {
    theme: theme ?? parent?.theme ?? "warm",
    mode: mode ?? parent?.mode ?? "light",
    density: density ?? parent?.density ?? "comfortable",
    dir: dir ?? parent?.dir ?? "ltr",
    container,
  };
  return (
    <ThemeContext.Provider value={value}>
      <Direction.Provider dir={value.dir}>
        <div
          {...props}
          className={cn("ui-theme", className)}
          data-ui-theme={value.theme}
          data-ui-mode={value.mode}
          data-ui-density={value.density}
          dir={value.dir}
        >
          {children}
          <div ref={setContainer} className="contents" data-ui-portal="" />
        </div>
      </Direction.Provider>
    </ThemeContext.Provider>
  );
}

/** Keep nested overlays within their owning modal's focus and accessibility tree. */
export function PortalScope({ children }: { children: ReactNode }) {
  const parent = useContext(ThemeContext);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  if (!parent) throw new Error("PortalScope requires ThemeScope.");
  return (
    <ThemeContext.Provider value={{ ...parent, container }}>
      {children}
      <div ref={setContainer} className="contents" data-ui-portal="" />
    </ThemeContext.Provider>
  );
}

/** Pass this host to a primitive's own Portal to preserve its presence lifecycle. */
export function usePortalContainer() {
  const scope = useContext(ThemeContext);
  if (!scope) throw new Error("Portaled components must be rendered inside ThemeScope.");
  return scope.container;
}
