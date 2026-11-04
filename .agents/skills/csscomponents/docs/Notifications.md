---
title: Notifications
description: Toast notification system with themes, stacking, swipe-to-dismiss, and programmatic control.
package: "@g4rcez/components"
export: "{ Notifications }"
import: "import { Notifications, useNotification } from '@g4rcez/components/notifications'"
category: display
---

# Notifications

Toast notification system with themes, stacking, swipe-to-dismiss, and programmatic control.

## Import

```tsx
import { Notifications, useNotification } from "@g4rcez/components/notifications";
```

## Setup

Wrap your app (or the subtree that needs toasts) with `Notifications`:

```tsx
import { Notifications } from "@g4rcez/components/notifications";
function App() {
    return (
        <Notifications max={5} timeout={5000}>
            {" "}
            <YourApp />{" "}
        </Notifications>
    );
}
```

## Props

### Provider

| Prop       | Type              | Default | Description                                                           |
| ---------- | ----------------- | ------- | --------------------------------------------------------------------- |
| `max`      | `number`          | `5`     | Maximum notifications displayed at once                               |
| `timeout`  | `number`          | `5000`  | Default auto-dismiss duration in ms; `0` disables automatic dismissal |
| `children` | `React.ReactNode` | —       | Subtree that can use `useNotification`                                |

### useNotification — notify function

Call the hook inside a component under `Notifications`:

```tsx
const notify = useNotification();
const subscription = notify("Saved", { theme: "success" });
```

**Parameters**

| Parameter | Type                  | Description                                    |
| --------- | --------------------- | ---------------------------------------------- |
| `message` | `Label`               | Notification body text (string or React node) |
| `options` | `NotificationOptions` | Optional configuration described below        |

**NotificationOptions**

| Option     | Type                 | Default          | Description                                                                                   |
| ---------- | -------------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| `id`       | `string`             | —                | Stable ID; updates a toast with this ID instead of creating a duplicate                       |
| `title`    | `Label`              | —                | Optional notification title                                                                   |
| `theme`    | `NotificationTheme`  | `"default"`      | Visual theme variant                                                                        |
| `timeout`  | `number`             | Provider default | Override auto-dismiss duration in ms; `0` disables automatic dismissal                      |
| `closable` | `boolean`            | `true`           | Show a close button unless `loading` is true; swipe and Escape dismissal still work          |
| `loading`  | `boolean`            | `false`          | Show a loading icon and hide the close button; this does not change the timeout             |

**Return value — `NotificationSubscriber`**

| Method  | Description                          |
| ------- | ------------------------------------ |
| `close` | Dismiss this specific notification   |
| `clear` | Dismiss all visible notifications    |

## Themes

| Value         | Appearance                                                                              |
| ------------- | --------------------------------------------------------------------------------------- |
| `"default"`   | Card background with foreground text                                                    |
| `"info"`      | `bg-alert-info-bg` / `text-alert-info-text` / `border-alert-info-border`                |
| `"success"`   | `bg-alert-success-bg` / `text-alert-success-text` / `border-alert-success-border`       |
| `"warn"`      | `bg-alert-warn-bg` / `text-alert-warn-text` / `border-alert-warn-border`                |
| `"danger"`    | `bg-alert-danger-bg` / `text-alert-danger-text` / `border-alert-danger-border`          |
| `"secondary"` | `bg-alert-secondary-bg` / `text-alert-secondary-text` / `border-alert-secondary-border` |
| `"muted"`     | `bg-alert-muted-bg` / `text-alert-muted-text` / `border-alert-muted-border`             |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                   | Library default                           |
| ------------------------------------------ | ----------------------------------------- |
| `--var-notification-surface-radius`        | `calc(var(--var-radius-base) * 1.333333)` |
| `--var-notification-surface-backdrop-blur` | `calc( var(--var-spacing-base) * 0.75 )`  |
| `--var-notification-content-gap`           | `calc(var(--var-spacing-base) * 0.75)`    |
| `--var-notification-content-padding`       | `calc(var(--var-spacing-base) * 1)` |

| Token | CSS Variable | Purpose |
| ----------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `bg-card-background`          | `--var-card-background`          | Card background utility; default notifications use `--var-color-background` |
| `border-card-border`          | `--var-card-border`              | Card border utility; default notifications use `--var-color-border`         |
| `text-foreground`             | `--var-color-foreground`         | Default notification text                                                   |
| `bg-alert-{theme}-bg`         | `--var-alert-{theme}-background` | Background for `info`, `warn`, `danger`, `success`                          |
| `text-alert-{theme}-text`     | `--var-alert-{theme}-foreground` | Text for `info`, `warn`, `danger`, `success`                                |
| `border-alert-{theme}-border` | `--var-alert-{theme}-border`     | Border for `info`, `warn`, `danger`, `success`                              |
| `bg-alert-muted-bg`           | `--var-color-muted`              | Muted background                                                            |
| `text-alert-muted-text`       | `--var-color-muted-foreground`   | Muted text                                                                  |
| `border-alert-muted-border`   | `--var-color-border`             | Muted border                                                                |

## Examples

### Basic Notifications

```tsx
import { Button } from "@g4rcez/components/button";
import { useNotification } from "@g4rcez/components/notifications";

function NotificationExamples() {
    const notify = useNotification();

    return (
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => notify("Default notification")}>Default</Button>
            <Button onClick={() => notify("Info message", { theme: "info" })}>Info</Button>
            <Button onClick={() => notify("Success!", { theme: "success" })}>Success</Button>
            <Button onClick={() => notify("Warning", { theme: "warn" })}>Warning</Button>
            <Button onClick={() => notify("Error occurred", { theme: "danger" })}>Error</Button>
        </div>
    );
}
```

### With Title

```tsx
import { Button } from "@g4rcez/components/button";
import { useNotification } from "@g4rcez/components/notifications";

function SaveButton() {
    const notify = useNotification();

    return (
        <Button
            onClick={() =>
                notify("Your changes have been saved.", {
                    title: "Changes saved",
                    theme: "success",
                    timeout: 3000,
                })
            }
        >
            Save
        </Button>
    );
}
```

### Persistent Notification with Manual Close

```tsx
import { Button } from "@g4rcez/components/button";
import { useNotification } from "@g4rcez/components/notifications";

function ProcessButton() {
    const notify = useNotification();

    const startProcess = async () => {
        const subscription = notify("Processing your request…", {
            title: "In progress",
            theme: "info",
            timeout: 0,
            closable: false,
            loading: true,
        });

        await Promise.resolve(); // Replace with the operation to monitor.
        subscription.close();
        notify("Process completed successfully!", { theme: "success" });
    };

    return <Button onClick={startProcess}>Start</Button>;
}
```

### Form Submission Feedback

```tsx
import { Button } from "@g4rcez/components/button";
import { Input } from "@g4rcez/components/input";
import { useNotification } from "@g4rcez/components/notifications";

function ContactForm() {
    const notify = useNotification();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!data.get("message")) {
            notify("Enter a message before sending.", { theme: "warn" });
            return;
        }
        notify("Message sent successfully.", { title: "Done", theme: "success" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input name="message" title="Message" required />
            <Button type="submit">Send message</Button>
        </form>
    );
}
```

### Updating an Existing Toast

```tsx
import { Button } from "@g4rcez/components/button";
import { useNotification } from "@g4rcez/components/notifications";

function SyncButton() {
    const notify = useNotification();

    const startSync = () => {
        const id = "data-sync";
        notify("Syncing data…", { id, theme: "info", timeout: 0 });
        window.setTimeout(() => notify("Sync complete.", { id, theme: "success", timeout: 3000 }), 2000);
    };

    return <Button onClick={startSync}>Sync data</Button>;
}
```

## Do

- Use the correct `theme` to convey message severity (`success`, `danger`, `warn`).
- Keep messages short, but complete enough to explain the result — do not rely on a toast for long or essential instructions.
- Use `title` for a concise description of the result.
- Set `timeout: 0` for an operation update that must not expire automatically; keep critical errors and recovery actions in persistent task content, not only in a toast.
- Use `loading: true` for in-progress operations to signal activity.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`) — use `theme` instead.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block.
- Don't use notifications for information that must be acknowledged before proceeding — use a `Modal` instead.
- Don't show more than 3–5 notifications at a time; configure `max` accordingly.
- Don't use notifications for persistent status indicators — use `Alert` or a status bar.

## Interaction design and acceptance criteria

- Choose `Notifications` for brief, non-blocking feedback after an action. State the outcome in text, without depending on the theme/icon. Critical failures, mandatory decisions, destructive confirmation, and information needed later belong in persistent task content such as [Alert](Alert.md) or an appropriate [Modal](Modal.md), not solely in the toast stack.

- The provider defaults to 5000 ms. `timeout: 0` disables automatic dismissal in the current Base UI dependency; `Infinity` is forwarded to timers, not treated as a persistence flag. `loading` only changes the icon and hides close, so set a timeout policy explicitly. `closable: false` hides the button but does not prevent right-swipe or focused Escape dismissal. Even a non-expiring toast can become hidden by stack limits or be cleared programmatically; it is not durable storage.
- Do not move task focus merely to show feedback. Base UI currently supplies a polite Notifications region, keyboard-focusable toast roots, F6 access to the viewport, and timer pause/resume on hover and keyboard focus. Themes do not select announcement urgency, and this wrapper exposes no priority/live-region option. Verify announcements, timing, and focus after update/dismissal in the integrated application rather than assuming assistive-technology delivery.
- Current limitations: the built-in close button contains a decorative icon but no accessible name, and `NotificationOptions` exposes no close-label override. The component CSS defines hover feedback, not a dedicated close-button focus-visible rule. Supply clear names for any consumer actions using existing `Button` controls; that does not repair the built-in close control. Keyboard dismissal can also use Escape while a toast contains focus, but a clearly named close button remains an unmet target.
- The custom stack renders only three toasts without hover, up to `max` on hover. Its `+N more` badge is a non-interactive element, and keyboard focus does not expand this custom slice. Do not rely on hover-only messages for recovery or actions. Titles use single-line ellipsis, the text container hides overflow, and descriptions carry a two-line-clamp class. Verify complete essential wording, reading order, touch dismissal, and unobstructed task/virtual-keyboard controls at 200% text size and a 320 CSS-pixel viewport.

## Acceptance criteria

These are integration targets, not exercised accessibility tests; naming and full-stack access expose current gaps. 1. **Given** an action completes while its control has focus, **when** a toast appears, **then** the outcome is available in text without moving task focus, and the polite-region update is checked with the intended assistive technologies. 2. **Given** a displayed toast has an action or close control, **when** a user reaches it by keyboard or touch, **then** it has a clear name, visible focus, and usable activation/dismissal. Verify focus returns to a surviving toast or task control; the built-in close name is currently missing. 3. **Given** a timed message or loading update, **when** it is read, focused, hovered, updated, or dismissed, **then** the chosen duration and pause policy allow use without losing an action; `timeout: 0` does not auto-expire, and loading alone is not a persistence mechanism. 4. **Given** more than three updates or a critical failure, **when** the stack hides or removes a message, **then** essential information and recovery remain available through persistent, keyboard/touch-reachable task content. 5. **Given** long text, zoom, or a virtual keyboard, **when** feedback appears and is read, **then** essential wording is not lost to truncation and the stack does not cover controls needed to continue the task.

## Accessibility

- Delegates live-region and focus behavior to Base UI Toast. The currently installed primitive uses a polite region; this wrapper does not expose announcement priority.
- Toast roots and close buttons use the primitive's keyboard behavior; Escape closes a toast containing focus. The built-in close button currently lacks an accessible name.
- Right-swipe dismissal is enabled through `swipeDirection="right"` even when the close button is hidden.
- Timer pause/resume and focus restoration come from the dependency and need integration verification, especially when the wrapper's hover-only stack slice removes items.

## Notes

- Up to 3 notifications are visible by default; hovering the stack reveals all (up to `max`).
- Animations use Framer Motion (`motion/react`) with spring physics for enter/exit.
- The viewport is centered at the top with `--var-notification-viewport-inset-block-start` and `--var-layer-floating`; it is not styled with a hardcoded z-index.
- When the hover-limited slice contains additional toasts, a `+N more` badge shows that slice's hidden count. It is not an interactive expander or a count of every toast beyond `max`.

```

```
