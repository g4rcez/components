---
title: Wizard
description: Guided tour overlay that highlights page elements step-by-step with animated SVG masking and floating tooltips.
package: "@g4rcez/components"
export: "{ Wizard }"
import: "import { Wizard } from '@g4rcez/components'"
category: floating
---

# Wizard

Guided tour overlay. It highlights page elements step by step with animated SVG masking and floating tooltips.

## Import

```tsx
import { Wizard } from "@g4rcez/components";
```

## Props

### Wizard props

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `false` | Shows the wizard. |
| `steps` | `WizardStep[]` | — | Ordered step configurations. |
| `onClose` | `() => void` | — | Called on skip or dismiss. |
| `onFinish` | `() => void` | — | Called when the last step completes. |
| `onChange` | `(index: number) => void` | — | Called when the step index changes. |
| `labels` | `{ next?: string; skip?: string; finish?: string; previous?: string }` | — | Button labels. Missing values use `useTranslations`. |

### WizardStep

| Prop | Type | Default | Description |
|---|---|---|---|
| `element` | `string \| Element \| React.RefObject<Element \| null>` | — | Target: CSS selector, DOM element, or React ref. |
| `title` | `React.ReactNode` | — | Step title in the tooltip. |
| `description` | `React.ReactNode` | — | Step body content. |
| `side` | `Placement` | `"bottom"` | Tooltip placement. |
| `onEnter` | `() => void` | — | Called when this step becomes active. |
| `onNext` | `() => void` | — | Called before advancing to the next step. |
| `onPrevious` | `() => void` | — | Called before going back one step. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides win. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The first table lists examples. `defaultGeometryTokens` holds the full set.

| Override | Library default |
|---|---|
| `--var-wizard-focus-outline-width` | `calc(var(--var-spacing-base) * 0.125)` |
| `--var-wizard-focus-outline-offset` | `calc(var(--var-spacing-base) * 0.125)` |
| `--var-wizard-surface-inline-size` | `calc(var(--var-spacing-base) * 20)` |
| `--var-wizard-surface-max-inline-size` | `calc(var(--var-spacing-base) * 24)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| CSS override | `--var-wizard-overlay-background` | SVG mask fill, including opacity |
| CSS override | `--var-wizard-surface-background` | Step tooltip surface |
| CSS override | `--var-wizard-surface-border` | Tooltip border, arrow stroke, footer divider |
| `z-wizard` | `--var-layer-wizard` | Layer base. Root uses `calc(var(--var-layer-wizard) + 1)`. |
| CSS override | `--var-wizard-label-foreground` | Step counter and skip button text |
| CSS override | `--var-wizard-label-foreground-hover` | Skip button hover text |

## Examples

### Basic Two-Step Tour

```tsx
import { useState } from "react";
import { Wizard } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
function OnboardingTour() {
    const [active, setActive] = useState(false);
    const steps = [
        {
            element: "#create-button",
            title: "Create something new",
            description: "Use this button to create a new project.",
            side: "bottom" as const,
        },
        { element: "#notifications-bell", title: "Stay up to date", description: "Check here for the latest updates.", side: "left" as const },
    ];
    return (
        <>
            {" "}
            <Button onClick={() => setActive(true)}>Start Tour</Button>{" "}
            <Wizard
                active={active}
                steps={steps}
                onClose={() => setActive(false)}
                onFinish={() => {
                    setActive(false);
                    console.log("Tour complete");
                }}
            />{" "}
        </>
    );
}
```

### Using Refs as Targets

```tsx
import { useRef, useState } from "react";
import { Wizard } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
function RefTour() {
    const [active, setActive] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const steps = [{ element: buttonRef, title: "Action Button", description: "Click here to perform the primary action.", side: "right" as const }];
    return (
        <>
            {" "}
            <Button ref={buttonRef} theme="primary">
                {" "}
                Primary Action{" "}
            </Button>{" "}
            <Wizard active={active} steps={steps} onClose={() => setActive(false)} labels={{ finish: "Got it!", skip: "No thanks" }} />{" "}
        </>
    );
}
```

### Step Lifecycle Callbacks

```tsx
const steps = [
    {
        element: "#dashboard-chart",
        title: "Your Analytics",
        description: "This chart shows activity for the last 30 days.",
        onEnter: () => console.log("User reached analytics step"),
        onNext: () => console.log("User advancing past analytics"),
    },
    { element: "#export-button", title: "Export Data", description: "Download your data at any time.", side: "left" as const },
];
```

### Custom Labels

```tsx
<Wizard
    active={active}
    steps={steps}
    onClose={() => setActive(false)}
    onFinish={() => setActive(false)}
    labels={{ next: "Continue", previous: "Back", skip: "Skip tour", finish: "Done" }}
/>
```

## Do

- Keep tours to 3–7 steps. Fewer steps complete more often.
- Make each target visible in the viewport when its step activates. The wizard scrolls to it.
- Always provide `onClose`, so users can exit at any time.
- Use `onEnter` to make the target visible (for example, open a panel) before the step highlights it.

## Don't

- Don't put critical information only in the wizard. Users skip it.
- Don't pass more than ~10 steps. Users abandon long tours.
- Don't block navigation when the user skips the wizard.
- Don't pass raw utility color classes in `title` or `description`. Use design-token classes.
- Don't use arbitrary utility values (`z-[9999]`). The wizard uses `z-wizard`. Override the CSS variable.

## Accessibility

- The wizard renders in a `FloatingPortal` above other content.
- The overlay is `pointer-events-none`. Only the SVG mask rect is `pointer-events-auto`, so users can click the highlighted element during the tour.
- Navigation buttons use `Button` and support the keyboard.
- Step progress shows as `{current} / {total}` in the tooltip corner.
- The `FloatingArrow` points from the tooltip to the target.

## Data Attributes

| Attribute | Applied to | Description |
|---|---|---|
| `data-component="wizard"` | Main wizard container | Wizard overlay root |

## Notes

- The SVG mask is a `<motion.rect>` that animates to the target bounding rect with a spring transition.
- The tooltip appears only after the animation completes (`onAnimationComplete`).
- When `element` resolves to `null` (selector not found or ref empty), the tooltip centers on screen and the console warns.
- `useResizeObserver` and scroll and resize listeners keep the highlight rect in sync.
