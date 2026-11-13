# Token contract

Runtime variables are prefixed `--ui-`. `themes/warm.css` supplies the default values at `:root`; theme attributes set explicit values per scope. Each theme has a light palette and a dark override. `tokens.css` uses Tailwind v4's `@theme inline` so utilities read runtime variables where they are used, including nested scopes.

## Color roles

| Roles                                                                | Use / allowed pairing                                                                                                             |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `canvas`, `surface`, `sunken`, `overlay`                             | Page, panel, recessed region, floating surface. Use `fg` or `muted` text.                                                         |
| `fg`, `muted`                                                        | Primary and secondary readable text on neutral surfaces, including `hover` and `pressed`.                                         |
| `border`                                                             | Decorative separators. Not a substitute for an essential control boundary.                                                        |
| `input-border`                                                       | Essential input/control boundaries on neutral surfaces.                                                                           |
| `action`, `action-hover`, `on-action`                                | Primary action surfaces and their foreground. Both backgrounds must work with `on-action`.                                        |
| `hover`, `pressed`                                                   | Neutral interaction surfaces. These do not represent persistent selection.                                                        |
| `selected`, `on-selected`, `selection-border`, `on-selection-border` | Persistent selection surface, text, and control indicator. Checked switch thumbs use `on-selection-border` on `selection-border`. |
| `focus`                                                              | Focus outline on neutral surfaces. Outline offset separates it from solid button backgrounds.                                     |
| `danger`, `danger-hover`, `on-danger`                                | Destructive action surfaces and their foreground.                                                                                 |
| `{success,warning,danger,info}-soft` and `-text`                     | Paired status surfaces and text. Include words/icons to convey meaning.                                                           |
| `blanket`                                                            | Dimmed backdrop behind modal surfaces.                                                                                            |

Primary action, status, and selection remain distinct even when the values happen to be equal. Never assume white text works on a brand's primary color: Crisp intentionally needs dark action text. Colors for charts, customer documents, and uploaded content are separate product concerns.

Allowed pair verification is in `tests/browser/system.spec.ts`: normal text targets 4.5:1, essential neutral control boundaries and focus indicators target 3:1. Decorative separators are intentionally subtler. These are specific tested pairs, not permission to combine any two tokens arbitrarily.

## Company adapter

Keep the role names stable and alias your host company's variables into them. Load the adapter after the starter themes. This partial example changes only action and typography; all other roles retain the starter values:

```css
[data-ui-theme="warm"] {
  --ui-action: var(--company-action-background);
  --ui-action-hover: var(--company-action-hover);
  --ui-on-action: var(--company-action-foreground);
  --ui-font-sans: var(--company-font-body);
  --ui-radius-control: var(--company-radius-control);
}

/* Match the theme's dark selector specificity, too. */
[data-ui-theme="warm"][data-ui-mode="dark"] {
  --ui-action: var(--company-dark-action-background);
  --ui-action-hover: var(--company-dark-action-hover);
  --ui-on-action: var(--company-dark-action-foreground);
}
```

The example assumes those company variables exist. For an entirely new theme, duplicate a theme file, supply every color role in both modes, and extend the `Theme` union in `components/theme.tsx` plus your preview options. Re-run contrast and screen checks after mapping values; aliases do not guarantee accessible pairs. Keep a complete light mapping on the theme selector so an explicitly light nested scope also works inside a dark parent.

## Other foundations

- `--ui-radius-control`, `--ui-radius-panel`: company shape language. Truly circular shapes use `rounded-full` independently.
- `--ui-font-sans`: local font stack for each theme; `font-mono` has a separate local fallback.
- `type-display`, `type-title`, `type-heading`, `type-body`, `type-label`, `type-caption`, `type-eyebrow`: full type recipes. Change size, line height, tracking, and weight together in the bridge. Preserve native heading structure separately.
- `--ui-space-group`, `--ui-space-section`: related content versus separation between sections. Normal Tailwind spacing remains available for page layouts.
- `--ui-control-height`, `--ui-control-px`, `--ui-control-gap`, `--ui-row-py`: density only. Comfortable controls are 44px high and compact controls 36px at a 16px root. Native checkbox/radio hit areas are 24px. Do not change the root font size to implement density.
- `--ui-shadow-raised`, `--ui-shadow-overlay`: low surface elevation and floating elevation.
- `--ui-duration`, `--ui-ease`: reserved plain CSS foundation values for host-specific motion. Current primitive transitions use Tailwind defaults; reduced-motion overrides are scoped in `tailwind.css`.

## Extending the contract

Add a role when it represents a reusable meaning, not a single screenshot color. Define it in every theme/mode, bridge it into Tailwind, describe allowed foreground/background pairs, and extend the contrast matrix. Use component-specific variable hooks only when a real consumer needs a different mapping. Page examples and patterns should not know which palette a role references.
