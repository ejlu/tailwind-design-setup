# Contributing to the starter

- Keep the foundation portable. React behavior belongs in components, not token CSS.
- Read README.md and docs/tokens.md before extending the system.
- Use semantic color utilities and named typography styles in components and examples. Raw colors belong only in themes. Primary actions, status, selection, and focus are independent roles.
- Keep literal Tailwind class strings; do not construct utility names at runtime.
- Keep component behavior on native HTML or Radix primitives. Preserve labels, keyboard behavior, focus restoration, and reduced-motion support.
- Use ThemeScope for nested theme/mode/density/direction. All portaled components use its scoped container with the primitive’s own Portal so overlays inherit the same scope.
- Use component density tokens; never rescale Tailwind's global spacing unit to implement compact mode.
- Keep patterns small. Promote a new pattern after it repeats in real examples. Page layout stays ordinary Tailwind.
- Run npm run check and npm run test:browser before a PR. Browser checks are local fixtures only; no service keys or paid API calls are needed.
- Preserve the MIT license. Do not introduce private company code, proprietary fonts, or credentials.
