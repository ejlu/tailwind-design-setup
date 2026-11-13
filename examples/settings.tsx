import { useState, type FormEvent } from "react";
import { Bell, Globe2, ShieldCheck } from "lucide-react";
import {
  ActionRow,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Field,
  FieldControl,
  Input,
  Radio,
  Section,
  Select,
  Switch,
  Textarea,
} from "../src";

export function SettingsExample() {
  const [name, setName] = useState("Kinfolk Studio");
  const [email, setEmail] = useState("hello@example.com");
  const [digest, setDigest] = useState(true);
  const [activity, setActivity] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const nameError = error && !name.trim() ? "Enter a workspace name." : undefined;
  const emailError =
    error && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address." : undefined;
  function save(event: FormEvent) {
    event.preventDefault();
    const invalid = !name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError(invalid);
    setSaved(!invalid);
  }
  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_15rem]">
      <form
        noValidate
        onSubmit={save}
        onChange={() => {
          setSaved(false);
        }}
        className="min-w-0 space-y-section"
      >
        <Section
          title="Workspace profile"
          description="The details your team sees when they sign in."
        >
          <Card className="space-y-5 sm:p-6">
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <div
                aria-hidden="true"
                className="type-title flex size-14 items-center justify-center rounded-panel bg-selected text-on-selected"
              >
                K
              </div>
              <div>
                <p className="type-label">Kinfolk Studio</p>
                <p className="type-caption text-muted">Your shared space to do good work.</p>
              </div>
            </div>
            <Field label="Workspace name" error={nameError}>
              <FieldControl>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="organization"
                  required
                />
              </FieldControl>
            </Field>
            <Field
              label="Contact email"
              description="For account updates and billing receipts."
              error={
                error && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Enter a valid email address."
                  : undefined
              }
            >
              <FieldControl>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </FieldControl>
            </Field>
            <Field label="About your team" description="A little context for new teammates.">
              <FieldControl>
                <Textarea defaultValue="An independent design team making thoughtful things for everyday life." />
              </FieldControl>
            </Field>
          </Card>
        </Section>
        <Section title="Preferences" description="Make the workspace feel right for your team.">
          <Card className="divide-y divide-border py-0 sm:px-6">
            <ActionRow
              leading={<Globe2 aria-hidden="true" />}
              title={<label htmlFor="timezone">Time zone</label>}
              description="Used to schedule team activity."
              trailing={
                <Select id="timezone" defaultValue="ny" className="max-w-40" aria-label="Time zone">
                  <option value="ny">New York</option>
                  <option value="ldn">London</option>
                  <option value="tokyo">Tokyo</option>
                </Select>
              }
            />
            <ActionRow
              leading={<Bell aria-hidden="true" />}
              title={<label htmlFor="digest">Email digests</label>}
              description="A weekly summary of what matters."
              trailing={
                <Switch
                  id="digest"
                  checked={digest}
                  onCheckedChange={(v) => {
                    setDigest(v);
                    setSaved(false);
                  }}
                />
              }
            />
            <ActionRow
              leading={<ShieldCheck aria-hidden="true" />}
              title={<label htmlFor="activity">Activity updates</label>}
              description="Let teammates know when you make changes."
              trailing={
                <Switch
                  id="activity"
                  checked={activity}
                  onCheckedChange={(v) => {
                    setActivity(v);
                    setSaved(false);
                  }}
                />
              }
            />
          </Card>
        </Section>
        <Section title="Sharing defaults">
          <Card className="space-y-4 sm:p-6">
            <fieldset className="space-y-3">
              <legend className="type-label mb-3">New projects are visible to</legend>
              <label className="type-body flex min-h-6 items-center gap-3">
                <Radio name="visibility" value="team" defaultChecked />
                Everyone in the workspace
              </label>
              <label className="type-body flex min-h-6 items-center gap-3">
                <Radio name="visibility" value="invite" />
                Invited people only
              </label>
            </fieldset>
            <label className="type-body flex min-h-6 items-center gap-3 border-t border-border pt-4">
              <Checkbox defaultChecked />
              Allow members to invite teammates
            </label>
          </Card>
        </Section>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="type-caption text-muted">Changes apply to this preview only.</p>
          <Button type="submit">Save changes</Button>
        </div>
        <div role="alert" aria-atomic="true">
          {(nameError || emailError) && (
            <Alert tone="danger" role="none">
              Check the highlighted fields before saving.
            </Alert>
          )}
        </div>
        <div role="status" aria-atomic="true">
          {saved && (
            <Alert tone="success" role="none">
              Workspace changes saved in this preview.
            </Alert>
          )}
        </div>
      </form>
      <aside className="space-y-5 xl:pt-20">
        <div className="type-eyebrow text-muted">A considered foundation</div>
        <p className="type-body text-muted">
          Clear hierarchy. Familiar controls. Enough room for your brand to feel at home.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>Semantic colors</Badge>
          <Badge>Keyboard ready</Badge>
          <Badge>Theme aware</Badge>
        </div>
        <div className="border-t border-border pt-4">
          <p className="type-label">Same components. Your identity.</p>
          <p className="type-caption mt-2 text-muted">
            Use the appearance controls to see this screen adapt without changing its code.
          </p>
        </div>
      </aside>
    </div>
  );
}
