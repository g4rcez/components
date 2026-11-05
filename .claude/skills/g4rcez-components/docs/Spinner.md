---
title: Spinner
description: Accessible loading indicator for indeterminate work with a reduced-motion static state, plus an optional full-container wrapper.
package: "@g4rcez/components"
export: "{ Spinner, Loading }"
import: "import { Spinner, Loading } from '@g4rcez/components'"
category: display
---

# Spinner

`Spinner` indicates work with an unknown completion time. Rotation is disabled when reduced motion is preferred. `Loading` centers a spinner in a full-size container.

## Import

```tsx
import { Spinner, Loading } from "@g4rcez/components";
```

## Props

### Spinner props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class for the spinner element. |

### Loading

`Loading` accepts no props. It renders a container with `Spinner` centered inside.

## Design Tokens and CSS

Defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides take precedence. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The table shows examples; the exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-spinner-indicator-size` | `calc(var(--var-spacing-base) * 3)` |
| `--var-spinner-indicator-border-width` | `calc(var(--var-spacing-base) * 0.25)` |
| `--var-spinner-container-padding` | `calc(var(--var-spacing-base) * 3)` |

The component ships `@g4rcez/components/spinner.css`. Stable selectors are `.__spinner` and `.__spinner__container`. The stylesheet reads `--var-spinner-indicator-size`, `--var-spinner-indicator-border-width`, `--var-spinner-spin-duration`, `--var-spinner-container-padding`, `--var-color-background`, `--var-color-primary`, and `--var-rounded-full`.

## Examples

### Inline spinner

```tsx
<Spinner />
```

### Loading container

```tsx
{
    isLoading ? <Loading /> : <Content />;
}
```

### Inside a button

```tsx
<Button disabled={isSaving}>
    {" "}
    {isSaving ? <Spinner /> : null} {isSaving ? "Saving…" : "Save"}
</Button>
```

`Spinner` declares only `className` and is always an announced status. To avoid announcement, use a separate decorative element for the inline indicator.

## Do

- Use `Spinner` for indeterminate operations. Use `Progress` when completion can be measured.
- Use `Loading` when its parent has a meaningful width and height.
- Keep a nearby status message when the operation needs more context than "Loading".

## Don't

- Don't display a spinner indefinitely without an error or timeout path.
- Don't render many competing spinners for one operation.
- Don't use raw color values. Override semantic `--var-*` tokens.

## Accessibility

- `Spinner` renders `role="status"`, `aria-live="polite"`, and a localized `aria-label` from `useTranslations`.
- `Loading` uses the same accessible `Spinner` and adds a layout container.
- Do not hide the only status indicator from assistive technology while work runs.

## Data Attributes

- `data-component="spinner"`: the spinner element and the `Loading` container.
- `data-slot="container"`: the `Loading` wrapper.

## Notes

- The spinner is a border arc with CSS animation. It does not report numeric progress.
- The default translation is `Loading` in the default locale. `ComponentsProvider` translations change it.
