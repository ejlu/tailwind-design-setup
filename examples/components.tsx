import { useState } from "react";
import { ArrowRight, Plus, SlidersHorizontal } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldControl,
  IconButton,
  Input,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Section,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ThemeScope,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../src";

function ScopedDialog() {
  const [message, setMessage] = useState("Member");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Open scoped dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-5">
          <div className="space-y-2">
            <DialogTitle>A theme that follows you</DialogTitle>
            <DialogDescription>
              This dialog and its menu inherit the theme, density, and direction of the panel that
              opened them.
            </DialogDescription>
          </div>
          <Menu>
            <MenuTrigger asChild>
              <Button variant="secondary">Role: {message}</Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onSelect={() => setMessage("Member")}>Member</MenuItem>
              <MenuItem onSelect={() => setMessage("Guest")}>Guest</MenuItem>
            </MenuContent>
          </Menu>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open nested dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-5">
                <DialogTitle>A second layer</DialogTitle>
                <DialogDescription>
                  This modal still covers the viewport and returns focus to its parent dialog.
                </DialogDescription>
                <DialogClose asChild>
                  <Button>Close nested dialog</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function ComponentsExample() {
  return (
    <div className="space-y-section">
      <Section title="Tabs" description="Use the arrow keys to move between views.">
        <Card>
          <Tabs defaultValue="overview">
            <TabsList aria-label="Project views">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="type-body">A shared view of your project.</p>
            </TabsContent>
            <TabsContent value="activity">
              <p className="type-body">Your team's latest updates.</p>
            </TabsContent>
          </Tabs>
        </Card>
      </Section>
      <Section title="Actions" description="Small APIs, consistent behavior, explicit intent.">
        <Card className="flex flex-wrap items-center gap-3">
          <Button>
            Primary action
            <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Delete</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton label="Add item">
                <Plus aria-hidden="true" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Add item</TooltipContent>
          </Tooltip>
        </Card>
      </Section>
      <Section title="Feedback">
        <Card className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Draft</Badge>
            <Badge tone="success">Published</Badge>
            <Badge tone="warning">In review</Badge>
            <Badge tone="danger">Needs attention</Badge>
            <Badge tone="info">Updated</Badge>
          </div>
          <Alert>Updates will appear here as your team makes progress.</Alert>
          <Alert tone="danger" role="note">
            There was a problem saving. Your changes are still here.
          </Alert>
          <div className="flex items-center gap-3" role="status" aria-label="Loading preview">
            <Skeleton className="size-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </Card>
      </Section>
      <Section title="Field states">
        <Card className="grid gap-5 sm:grid-cols-2">
          <Field label="Project name" description="A short, memorable name.">
            <FieldControl>
              <Input placeholder="e.g. Spring launch" />
            </FieldControl>
          </Field>
          <Field label="Project URL" error="Use a URL beginning with https://.">
            <FieldControl>
              <Input defaultValue="example" />
            </FieldControl>
          </Field>
          <Field label="Read-only value">
            <FieldControl>
              <Input readOnly value="workspace-001" />
            </FieldControl>
          </Field>
          <Field label="Disabled value">
            <FieldControl>
              <Input disabled value="Managed by your team" />
            </FieldControl>
          </Field>
        </Card>
      </Section>
      <Section
        title="Nested themes & overlays"
        description="A dark, compact panel inside any outer theme. Open the dialog, then its role menu."
      >
        <ThemeScope
          theme="crisp"
          mode="dark"
          density="compact"
          className="rounded-panel border border-border p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="type-label flex items-center gap-2">
                <SlidersHorizontal aria-hidden="true" className="size-4" />A different context
              </p>
              <p className="type-caption mt-1 text-muted">Crisp · Dark · Compact</p>
            </div>
            <ScopedDialog />
          </div>
        </ThemeScope>
      </Section>
    </div>
  );
}
