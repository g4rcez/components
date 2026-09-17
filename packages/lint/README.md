# @g4rcez/components/lint

Oxlint rules for Tailwind design systems. The plugin is bundled with and
published as part of `@g4rcez/components`.

## Installation

Install the component library as a development dependency:

```bash
npm install --save-dev @g4rcez/components
# or
pnpm add --save-dev @g4rcez/components
```

Register the bundled plugin in `oxlint.config.ts` or `.oxlintrc.json`:

```json
{
    "jsPlugins": ["@g4rcez/components/lint"],
    "rules": {
        "shadcn/no-restyle": ["error", { "allow": ["layout"] }]
    }
}
```

## Rules

- `shadcn/no-restyle` — restricts classes passed to design-system components.
- `shadcn/no-raw-colors` — requires theme color tokens instead of raw colors.
- `shadcn/no-arbitrary-values` — reports arbitrary Tailwind values.
- `shadcn/no-inline-styles` — reports inline styles and `<style>` elements.
- `shadcn/no-unknown-classes` — reports classes Tailwind cannot generate.
- `shadcn/require-static-classes` — requires statically analyzable component classes.

The rules discover Tailwind v4 themes, `components.json`, component variants,
wrappers, and class helpers. See the source rule metadata for the complete
option schemas and the design-system documentation for the policy model.
