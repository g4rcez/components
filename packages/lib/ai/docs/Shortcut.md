---
title: Shortcut
description: Inline keyboard shortcut display with automatic OS-specific key symbol mapping.
package: "@g4rcez/components"
export: "{ Shortcut }"
import: "import { Shortcut } from '@g4rcez/components'"
category: display
---

# Shortcut

Inline keyboard shortcut display. It maps keys to OS-specific symbols.

## Import

```tsx
import { Shortcut } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Shortcut to display, e.g. `"Mod + K"` or `"Shift + Alt + P"` |

## Design Tokens

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-shortcut-content-gap` | `calc(var(--var-spacing-base) * 0.25)` |
| `--var-shortcut-icon-size` | `calc(var(--var-spacing-base) * 0.75)` |

`Shortcut` inherits text color and size from its parent. It has no component-scoped tokens.

## OS Mapping

`Shortcut` maps keys by the operating system of the user:

| Key token | macOS | Other |
|---|---|---|
| `Mod` | `⌘` (CommandIcon, `size={12}`) | `Ctrl` |
| `Alt` | `⌥` (OptionIcon, `size={12}`) | `Alt` |

`Shortcut` renders all other key tokens as written.

## Examples

### Basic Usage

```tsx
<Shortcut value="Mod + K" />
```

### In a Tooltip

```tsx
<Tooltip title="Save changes">
    {" "}
    <div className="flex gap-2 items-center">
        {" "}
        Save <Shortcut value="Mod + S" />{" "}
    </div>
</Tooltip>
```

### In a Command Palette Item

```tsx
<div className="flex items-center justify-between w-full">
    {" "}
    <span>Open command palette</span> <Shortcut value="Mod + K" />
</div>
```

### Complex Multi-Key Shortcuts

```tsx
<>
    <Shortcut value="Shift + Alt + P" />
    <Shortcut value="Mod + Shift + L" />
</>
```

### In a Menu Item

```tsx
<div className="flex items-center justify-between px-4 py-2">
    {" "}
    <span className="text-foreground">New File</span> <Shortcut value="Mod + N" />
</div>
```

## Do

- Use `"Mod"` instead of `"Ctrl"` or `"Cmd"` for automatic platform rendering.
- Use `"Alt"` for the Option/Alt key. It also gets platform rendering on macOS.
- Place `Shortcut` next to the label of the action it accelerates (button, menu item, tooltip).

## Don't

- Don't hardcode platform symbols like `⌘` or `Ctrl`. `Shortcut` maps them.
- Don't pass arbitrary utility values (`text-[--my-var]`) for text color. Let the component inherit from its parent.
- Don't use `Shortcut` for descriptive text longer than a keyboard combination.

## Accessibility

- Each key segment renders inside a `<kbd>` element with an `aria-label` equal to the raw key name (e.g. `aria-label="Mod"`). Screen readers announce the key name, not the visual symbol.
- Icon-based keys (`CommandIcon`, `OptionIcon`) also carry their own `aria-label` attribute.

## Notes

- The component renders a `<span>` with `flex items-center gap-1 text-sm`.
- The component splits keys on `"+"` and trims them. `"Mod + K"`, `"Mod+K"`, and `"Mod +K"` produce the same output.
- The OS check uses `isMac` from the internal `combi-keys` utility, which reads `navigator.userAgent`.
