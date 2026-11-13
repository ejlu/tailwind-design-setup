# Common Ground

A small, copyable design-system starter built with Tailwind CSS v4, React, and TypeScript. Start with working screens, then make the visual language your own.

**Two themes · Light and dark · Independent density · Scoped overlays · MIT**

## Run it

Use Node.js 22.22.2+, 24.15+, or 26+. Node 22 is used in CI; these minimums also cover the test tooling.

```sh
npm ci
npm run dev
```

Open the printed local URL. The gallery has **Settings**, **Resources**, and **Components** views. Theme, mode, density, and direction controls restyle the same screens. Settings, invitations, resource actions, and search use in-memory fixtures only; they do not persist changes, send email, or call an API.

## What is included

- **Warm:** soft neutrals, warm action color, rounded shapes, system typography.
- **Crisp:** cool neutrals, bright green actions with dark foregrounds, square geometry, Arial typography.
- Light/dark modes for both themes, independent comfortable/compact density, and LTR/RTL direction.
- Seven full typography styles: display, title, heading, body, label, caption, eyebrow.
- Buttons, icon buttons, input, textarea, native select, checkbox, radio, switch, badge, card, alert, skeleton, empty state, dialog, action menu, tooltip, tabs, and table primitives.
- Three small patterns: accessible **Field**, slotted **ActionRow**, and **Section**.
- Real settings and resource-table examples, including validation, loading, selection, empty results, and nested overlays.

This is a source starter, not a published component package. Its CSS-variable foundation can be used without React; the interactive components require React and Radix. There is no runtime service, account setup, proprietary font, or external asset requirement.

## Adopt it in a new company

### 1. Copy the foundation

Copy `src/styles/foundations.css` and the theme files you need. These are plain CSS. Their `--ui-*` variables are available without Tailwind or React. Import the foundation before your chosen theme and company overrides.

For Tailwind v4, also copy `tokens.css` and import it from your application's Tailwind entry:

```css
@import "tailwindcss";
@import "./design-system/foundations.css";
@import "./design-system/themes/warm.css";
@import "./design-system/tokens.css";
@import "./company-theme.css";
```

The gallery uses `src/styles/tailwind.css`, which also includes both themes and small scoped base styles. Import those base styles or equivalent `.ui-theme` font, color, background, and `color-scheme` styles in your application. Preserve the reduced-motion rule.

The role names are the contract. Map your company's existing tokens to them; don't rename the component utilities at every company. [Token roles and allowed pairs](docs/tokens.md) explain the boundary.

### 2. Copy the components you need

Copy `src/components`, `src/patterns`, and `src/lib` together to preserve their relative imports. `src/index.ts` is the optional barrel. Keep only the components you use and install their dependencies from this repo's `package.json`: React, Radix UI, CVA, clsx, tailwind-merge, and lucide-react.

```tsx
import { Button, Field, FieldControl, Input, ThemeScope } from "./design-system";

export function Profile() {
  return (
    <ThemeScope theme="warm" mode="light" density="comfortable" dir="ltr">
      <form>
        <Field label="Workspace name" description="Visible to your teammates.">
          <FieldControl>
            <Input autoComplete="organization" />
          </FieldControl>
        </Field>
        <Button type="submit">Save changes</Button>
      </form>
    </ThemeScope>
  );
}
```

`FieldControl` takes exactly one element that forwards `id`, ARIA attributes, and its ref to a control. Field owns the label association and appends its description/error IDs to the control's existing descriptions. Supply `id` on Field if you need a stable external ID. Radios belong in a native `fieldset` with a `legend`; checkbox/switch rows still need a visible associated label.

### 3. Choose scope deliberately

Wrap each application in `ThemeScope`. Nested scopes inherit unspecified settings. Our Dialog, Menu, and Tooltip wrappers use their primitive's Portal with the shared scoped container and remain inside the nearest theme/mode/density/direction scope. This avoids a dark panel opening a light menu. ThemeScope also provides Radix direction. DialogContent creates an inner PortalScope so nested menus stay inside its focus trap and accessibility tree. Custom modal wrappers should do the same.

Put `lang` on your document. Set `dir` on ThemeScope, and set it on the document too when the entire application is RTL. Use logical spacing utilities (`ps`, `pe`, `ms`, `me`, `start`, `end`). Avoid transformed/clipped ancestors around overlay hosts; a real application with a dedicated global overlay layer may need a portal adapter that reproduces the scope there.

Switch `className` styles the inner control button; apply flex/grid placement classes to its containing row or wrapper.

Typography styles are visual roles, independent of heading semantics: choose the appropriate `h1`–`h6` element, then apply `type-title` or `type-heading`. Edit the named styles as a set when a company font needs different metrics. All built-in fonts are local fallbacks; no font request is made.

### 4. Check the host application's CSS

- **Tailwind v4 is the supported integration.** The plain variables work in other stacks; a v3 bridge is not provided. Check [Tailwind browser support](https://tailwindcss.com/docs/compatibility) against your company's requirements.
- The gallery's `@import "tailwindcss"` includes Preflight. Existing applications may already have a reset. Tailwind documents [how to omit Preflight](https://tailwindcss.com/docs/preflight#disabling-preflight).
- Unlayered legacy CSS outranks layered utilities. Inspect the cascade before adding `!important` fixes.
- Copied source must be in Tailwind's scanned paths. For a future package outside automatic detection, add an explicit `@source` path as described in [source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).
- Keep complete utility strings in variants. Use `style` only for genuinely runtime values, not static company colors.
- Namespace runtime variables with `--ui-`. If host utility names collide, adapt the bridge or use Tailwind's prefix option consistently.

## Component conventions

```tsx
<Button variant="primary">Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button loading>Saving</Button>
<IconButton label="Add item"><Plus aria-hidden="true" /></IconButton>
```

Buttons default to `type="button"`; opt into submit explicitly. Loading disables activation, keeps the label, and sets `aria-busy`.

`ActionRow` accepts `leading`, `title`, `description`, and `trailing` slots. Its container is not interactive. Put a real labeled control/link/button in the appropriate slot. `Section` provides a heading and spacing, not a page layout framework; use `level={3}` (2–6 supported) for nested sections.

The table is semantic HTML, not an ARIA grid. The resource example owns filtering, sorting, selection, and row actions. Extend or replace that example's data logic for your product. Use native links for navigation; Button is an action.

Choose role utilities for appearance. Ordinary Tailwind grid, flex, wrapping, and responsive layout are encouraged. Do not scatter raw brand colors or `dark:` overrides through screen code. Density adjusts controls/rows only, leaving page layout spacing intact.

## Verification

```sh
npm run check                 # Formatting, unit/contract tests, typecheck, build
npx playwright install chromium
npm run test:browser          # Local browser fixtures only
```

Browser tests exercise all eight brand × mode × density combinations, semantic contrast pairs, axe checks on all three screens, dialog/menu keyboard behavior and scope inheritance, local invitation validation, RTL/mobile reflow, reduced motion, and forced-colors focus. CI runs the same commands. The tests do not use service keys or paid models.

Automated checks are a baseline. Before production adoption, review actual content, custom colors, long translations, zoom, touch targets, and assistive technology behavior in the browsers your company supports. This starter does not claim complete accessibility conformance.

## Dependency updates

Dependabot checks npm packages and GitHub Actions every Monday at 09:00 America/New_York once `.github/dependabot.yml` is merged into the default branch. It updates pinned npm versions and the lockfile. Minor and patch updates are grouped per ecosystem; major upgrades remain individual PRs. All three update types are eligible for automatic squash-merge after `Check starter` and all reported checks/statuses pass on the current PR head.

The merge workflow runs trusted default-branch code, verifies the Dependabot author and npm/GitHub Actions branch, and sends the exact tested SHA to GitHub's merge API. It does not run code or download artifacts from the update PR. If you add another package ecosystem, extend the allowlist in `.github/scripts/merge-dependabot.cjs` too. This policy starts once both workflows/configuration are merged into the default branch; no personal token or repository auto-merge setting is needed. For an existing update whose CI finished before a policy change was merged, re-run its `Check starter` workflow so the merge gate evaluates it again.

## Structure

```text
src/styles/       Plain foundations/themes and the Tailwind role bridge
src/components/   Native controls and Radix behavior with semantic styling
src/patterns/     Field, ActionRow, Section
src/lib/          Class composition
examples/         Settings, resource table, and component/state gallery
src/App.tsx       Preview shell and appearance controls
/tests            Behavioral, portability, contrast, and browser checks
```

## Design references

The system is original implementation informed by public design-system guidance. Airbnb's historical [DLS process](https://medium.com/airbnb-design/building-a-visual-language-behind-the-scenes-of-our-airbnb-design-system-224748775e4e) and [typography work](https://medium.com/airbnb-design/working-type-81294544608b) inform screen-led composition and named type styles. [Primer](https://primer.style/product/getting-started/foundations/color-usage/), [Atlassian](https://atlassian.design/tokens/design-tokens/), [Carbon](https://www.carbondesignsystem.com/building-blocks/foundations/color/guidelines), [React Aria](https://react-aria.adobe.com/quality), [Polaris](https://shopify.dev/docs/apps/build/app-home), and [Geist](https://vercel.com/geist/typography) inform roles, behavior, surface hierarchy, and practical patterns.

Neither theme reproduces a company's private system, font, or assets. Keep this starter small: promote patterns from real screens, and add package distribution, a registry, or design-tool synchronization when there is an actual consumer need.

## License

MIT. See [LICENSE](LICENSE). Version 0.1.0 is the initial source contract; use Git diffs when bringing improvements into a copied implementation.
