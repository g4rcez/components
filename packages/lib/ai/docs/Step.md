---
title: Step
description: Animated multi-step progress indicator with status tracking for checkout flows, onboarding, and wizards.
package: "@g4rcez/components"
export: "{ Step }"
import: "import { Steps, Step } from '@g4rcez/components'"
category: display
---
# Step

Animated multi-step progress indicator with status tracking for checkout flows, onboarding, and wizards.

## Import

```tsx
import { Steps, Step } from "@g4rcez/components";
```

## Props

### Steps (Container)

| Prop | Type | Default | Description |
|---|---|---|---|
| `currentStep` | `number` | — | Index of the active step |
| `steps` | `number` | — | Total number of steps |
| `children` | `React.ReactNode` | — | `Step` components |

### Step props

| Prop | Type | Default | Description |
|---|---|---|---|
| `step` | `number` | — | Index of this step |
| `currentStep` | `number` | — | Index of the active step (usually from parent) |
| `title` | `Label` | — | Step label |
| `status` | `StepStatus` | — | Overrides automatic status (`"active" \| "inactive" \| "complete" \| "error"`) |
| `titleClassName` | `string` | — | Extra classes for the title text |

`Step` forwards standard `<button>` props (e.g. `onClick`, `disabled`).

### Statuses

| Status | Visual | Icon |
|---|---|---|
| `active` | Primary color ring | Step number |
| `inactive` | Muted border | Step number |
| `complete` | Success color fill | Animated check mark |
| `error` | Danger color fill | Animated X mark |

Status derives from `step` vs. `currentStep` unless `status` overrides it.

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

| Override | Library default |
|---|---|
| `--var-step-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-step-marker-size` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-step-icon-size` | `calc(var(--var-spacing-base) * 1.5)` |
| `--var-step-label-padding-inline` | `calc(var(--var-spacing-base) * 0.5)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-primary` / `border-primary` | `--var-color-primary` | Active fill and border |
| `text-primary-foreground` | `--var-color-primary-foreground` | Active text |
| `bg-success` / `border-success` | `--var-color-success` | Complete fill, border, and connector |
| `text-success-foreground` | `--var-color-success-foreground` | Complete check icon |
| `bg-danger` / `border-danger-hover` | `--var-color-danger` / `--var-color-danger-hover` | Error fill and border |
| `text-danger-foreground` | `--var-color-danger-foreground` | Error X icon |
| `text-disabled` | `--var-color-disabled` | Inactive text |
| `bg-border` / `border-border` | `--var-color-border` | Default connector and inactive border |
| `bg-background` | `--var-color-background` | Inactive background |

## Examples

### Basic Steps

```tsx
<Steps currentStep={2} steps={3}>
    {" "}
    <Step step={1} currentStep={2} title="Account" /> <Step step={2} currentStep={2} title="Profile" />{" "}
    <Step step={3} currentStep={2} title="Review" />
</Steps>
```

### Interactive Wizard

```tsx
function Wizard() {
    const [currentStep, setCurrentStep] = useState(1);
    return (
        <div className="space-y-8">
            {" "}
            <Steps currentStep={currentStep} steps={4}>
                {" "}
                <Step step={1} currentStep={currentStep} title="Account" onClick={() => setCurrentStep(1)} />{" "}
                <Step step={2} currentStep={currentStep} title="Profile" onClick={() => setCurrentStep(2)} />{" "}
                <Step step={3} currentStep={currentStep} title="Payment" onClick={() => setCurrentStep(3)} />{" "}
                <Step step={4} currentStep={currentStep} title="Review" onClick={() => setCurrentStep(4)} />{" "}
            </Steps>{" "}
            <div className="p-6 rounded-card-radius border border-card-border bg-card-background">
                {" "}
                {currentStep === 1 && <AccountForm />} {currentStep === 2 && <ProfileForm />} {currentStep === 3 && <PaymentForm />}{" "}
                {currentStep === 4 && <ReviewSummary />}{" "}
            </div>{" "}
        </div>
    );
}
```

### With Error State

```tsx
<Steps currentStep={2} steps={3}>
    {" "}
    <Step step={1} currentStep={2} title="Identity" /> <Step step={2} currentStep={2} title="Payment" status="error" />{" "}
    <Step step={3} currentStep={2} title="Finish" />
</Steps>
```

### Checkout Flow

```tsx
function CheckoutSteps({ step }: { step: number }) {
    return (
        <Steps currentStep={step} steps={3}>
            {" "}
            <Step step={1} currentStep={step} title="Cart" /> <Step step={2} currentStep={step} title="Shipping" />{" "}
            <Step step={3} currentStep={step} title="Confirmation" />{" "}
        </Steps>
    );
}
```

## Do

- Give each step a clear, short `title`.
- Keep the total at 3–5 steps.
- Use `status="error"` to show where the user must return and fix a problem.
- Use `onClick` on `Step` to enable backward navigation in wizards.

## Don't

- Don't pass raw utility color classes for step styling. The component derives colors from CSS variables.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't hide critical information in steps the user has not yet seen.
- Don't use `Step` for non-linear navigation without a clear sequential intent.

## Accessibility

- Each `Step` renders as a `<button>`, so it is focusable and keyboard-operable.
- Icons use `aria-hidden` to prevent redundant screen reader announcements.
- The `Steps` container groups the process visually.

## Data Attributes

- `data-step`: the step index number, on each step's `<button>`.

## Notes

- Connector lines between steps show only at the `xl` breakpoint. On smaller screens the steps stack vertically and hide the lines.
- Animations use Framer Motion (`motion/react`). The step circle animates between status colors. The check/X icons draw in with `pathLength`.
- `Steps` tracks `previousStep` internally. It uses it to stagger transition delays when a jump skips several steps.
