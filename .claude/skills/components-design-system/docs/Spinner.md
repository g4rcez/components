---
title: Spinner
description: Accessible animated loading indicator for indeterminate work, with an optional full-container wrapper.
package: "@g4rcez/components"
export: "{ Spinner, Loading }"
import: "import { Spinner, Loading } from '@g4rcez/components'"
category: display
---

# Spinner

`Spinner` indicates work with an unknown completion time. `Loading` centers a spinner in a full-size container.

## Import

```tsx
import { Spinner, Loading } from "@g4rcez/components";
```

## Props

### Spinner

| Prop        | Type     | Default | Description                               |
| ----------- | -------- | ------- | ----------------------------------------- |
| `className` | `string` | —       | Additional class for the spinner element. |

### Loading

`Loading` accepts no props. It renders a container with `Spinner` centered inside it.

## Design Tokens and CSS

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
    {isSaving ? <Spinner /> : null}
    {isSaving ? "Saving…" : "Save"}
</Button>
```

`Spinner` only declares `className` in its public props and remains an announced status. Use a separate decorative element when an inline indicator should not be announced.

## Do

- Use `Spinner` for indeterminate operations and `Progress` when completion can be measured.
- Use `Loading` when its parent has a meaningful width and height.
- Keep a nearby status message when the operation needs more context than "Loading".

## Don't

- Don't display a spinner indefinitely without an error or timeout path.
- Don't render many competing spinners for one operation.
- Don't use raw color values; override semantic `--var-*` tokens.

## Accessibility

- `Spinner` renders `role="status"`, `aria-live="polite"`, and the localized `aria-label` from `useTranslations`.
- `Loading` uses the same accessible `Spinner` and adds a layout container.
- Do not hide the only status indicator from assistive technology while work is in progress.

## Data Attributes

- `data-component="spinner"` — spinner element and the `Loading` container.
- `data-slot="container"` — `Loading` wrapper.

## Notes

- The spinner uses a border arc and CSS animation; it does not report numeric progress.
- The default translation is `Loading` in the default locale and changes with `ComponentsProvider` translations.
