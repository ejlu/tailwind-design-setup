import { useState, useRef, type FormEvent } from "react";
import { ArrowUpRight, BookOpen, Check, Grid2X2, Layers2, Settings2, Users, X } from "lucide-react";
import { SettingsExample } from "../examples/settings";
import { ResourcesExample } from "../examples/resource-table";
import { ComponentsExample } from "../examples/components";
import {
  Alert,
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldControl,
  Input,
  Select,
  ThemeScope,
  TooltipProvider,
  type Density,
  type Mode,
  type TextDirection,
  type Theme,
} from "./index";

type View = "settings" | "resources" | "components";
const pages: Record<View, { number: string; title: string; description: string }> = {
  settings: {
    number: "01",
    title: "Workspace settings",
    description: "A shared space, shaped around your team.",
  },
  resources: {
    number: "02",
    title: "Your team's resources",
    description: "The work, knowledge, and ideas you share.",
  },
  components: {
    number: "03",
    title: "The building blocks",
    description: "A small collection, made to work together.",
  },
};
export function App() {
  const [theme, setTheme] = useState<Theme>("warm");
  const [mode, setMode] = useState<Mode>("light");
  const [density, setDensity] = useState<Density>("comfortable");
  const [dir, setDir] = useState<TextDirection>("ltr");
  const [view, setView] = useState<View>("settings");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState("");
  const inviteInput = useRef<HTMLInputElement>(null);
  const [inviteError, setInviteError] = useState(false);
  const [notice, setNotice] = useState("");
  function sendInvite(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite)) {
      setInviteError(true);
      requestAnimationFrame(() => inviteInput.current?.focus());
      return;
    }
    setNotice(`Invitation preview created for ${invite}. No email was sent.`);
    setInviteOpen(false);
    setInvite("");
  }
  const page = pages[view];
  return (
    <ThemeScope theme={theme} mode={mode} density={density} dir={dir} className="min-h-screen">
      <TooltipProvider delayDuration={350}>
        <a
          href="#main-content"
          className="focus-ring sr-only z-[80] rounded-control bg-surface focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:p-3"
        >
          Skip to content
        </a>
        <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="flex flex-col border-b border-border bg-surface lg:border-b-0 lg:border-e">
            <div className="flex items-center gap-3 px-6 py-7">
              <div
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-control bg-action text-on-action"
              >
                <Grid2X2 className="size-5" />
              </div>
              <div>
                <p className="type-label tracking-tight">Common Ground</p>
                <p className="type-caption text-muted">Design starter · 0.1</p>
              </div>
            </div>
            <div className="px-4 pb-5">
              <p className="type-eyebrow px-3 pb-3 text-muted">Explore the system</p>
              <nav aria-label="Examples" className="flex flex-wrap gap-1 lg:flex-col">
                {(
                  [
                    ["settings", Settings2, "Settings"],
                    ["resources", BookOpen, "Resources"],
                    ["components", Layers2, "Components"],
                  ] as const
                ).map(([key, Icon, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setView(key);
                      setNotice("");
                    }}
                    aria-current={view === key ? "page" : undefined}
                    className="focus-ring type-label flex min-h-control items-center gap-3 rounded-control px-3 text-start text-muted hover:bg-hover aria-[current=page]:bg-selected aria-[current=page]:text-on-selected"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                    <span
                      aria-hidden="true"
                      className="type-caption ms-auto hidden ps-4 text-muted lg:inline"
                    >
                      0{key === "settings" ? 1 : key === "resources" ? 2 : 3}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-auto hidden space-y-3 border-t border-border p-6 lg:block">
              <div aria-hidden="true" className="flex gap-1.5">
                <span className="size-3 rounded-full bg-action" />
                <span className="size-3 rounded-full bg-selection-border" />
                <span className="size-3 rounded-full bg-success-text" />
              </div>
              <p className="type-label">A foundation to make yours.</p>
              <p className="type-caption text-muted">
                Two themes. Shared components. Room for your next company.
              </p>
              <a
                className="focus-ring type-caption inline-flex items-center gap-1 rounded-control underline underline-offset-4"
                href="https://github.com/ejlu/tailwind-design-setup"
              >
                View source
                <ArrowUpRight aria-hidden="true" className="size-3" />
              </a>
            </div>
          </aside>
          <div className="min-w-0">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-8 xl:px-12">
              <p className="type-caption flex items-center gap-2 text-muted">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-success-text" />
                Interactive preview
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    label: "Theme",
                    value: theme,
                    change: (v: string) => setTheme(v as Theme),
                    options: [
                      ["warm", "Warm"],
                      ["crisp", "Crisp"],
                    ],
                  },
                  {
                    label: "Mode",
                    value: mode,
                    change: (v: string) => setMode(v as Mode),
                    options: [
                      ["light", "Light"],
                      ["dark", "Dark"],
                    ],
                  },
                  {
                    label: "Density",
                    value: density,
                    change: (v: string) => setDensity(v as Density),
                    options: [
                      ["comfortable", "Comfortable"],
                      ["compact", "Compact"],
                    ],
                  },
                  {
                    label: "Direction",
                    value: dir,
                    change: (v: string) => setDir(v as TextDirection),
                    options: [
                      ["ltr", "LTR"],
                      ["rtl", "RTL"],
                    ],
                  },
                ].map((control) => (
                  <label key={control.label} className="flex items-center gap-2">
                    <span className="type-caption text-muted">{control.label}</span>
                    <Select
                      aria-label={control.label}
                      value={control.value}
                      onChange={(e) => control.change(e.target.value)}
                      className="type-caption min-h-8 w-auto py-1"
                    >
                      {control.options.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </label>
                ))}
              </div>
            </header>
            <main
              id="main-content"
              tabIndex={-1}
              className="mx-auto max-w-6xl px-5 py-8 outline-none sm:px-8 xl:px-12 xl:py-12"
            >
              <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="type-eyebrow mb-3 text-muted">
                    The system in practice / {page.number}
                  </p>
                  <h1 className="type-display">{page.title}</h1>
                  <p className="type-body mt-3 text-muted">{page.description}</p>
                </div>
                <Dialog
                  open={inviteOpen}
                  onOpenChange={(open) => {
                    setInviteOpen(open);
                    setInviteError(false);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="mt-2">
                      <Users aria-hidden="true" />
                      Invite teammate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form noValidate onSubmit={sendInvite} className="space-y-5">
                      <div className="space-y-2">
                        <DialogTitle>Good work starts together.</DialogTitle>
                        <DialogDescription>
                          Create a local preview of a teammate invitation.
                        </DialogDescription>
                      </div>
                      <Field
                        label="Teammate email"
                        error={inviteError ? "Enter a valid email address." : undefined}
                      >
                        <FieldControl>
                          <Input
                            ref={inviteInput}
                            type="email"
                            autoComplete="email"
                            value={invite}
                            onChange={(e) => setInvite(e.target.value)}
                            placeholder="teammate@example.com"
                            required
                          />
                        </FieldControl>
                      </Field>
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit">Create invitation</Button>
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div role="status" aria-atomic="true">
                {notice && (
                  <Alert tone="success" role="none" className="mb-6">
                    <div className="flex items-center gap-3">
                      <Check aria-hidden="true" className="size-4" />
                      <span className="flex-1">{notice}</span>
                      <button
                        className="focus-ring rounded-control p-1"
                        aria-label="Dismiss notification"
                        onClick={() => setNotice("")}
                      >
                        <X aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </Alert>
                )}
              </div>
              {view === "settings" && <SettingsExample />}
              {view === "resources" && <ResourcesExample />}
              {view === "components" && <ComponentsExample />}
              <footer className="type-caption mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-muted">
                <span>Built to travel between teams.</span>
                <div className="flex items-center gap-2">
                  <Badge>{theme === "warm" ? "Warm" : "Crisp"}</Badge>
                  <span>Tailwind CSS · React · MIT</span>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </ThemeScope>
  );
}
