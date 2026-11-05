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

Wrap your app, or the subtree that needs toasts, with `Notifications`:

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

| Prop | Type | Default | Description |
|---|---|---|---|
| `max` | `number` | `5` | Maximum notifications displayed at once |
| `timeout` | `number` | `5000` | Default auto-dismiss time in ms; `0` disables automatic dismissal |
| `children` | `React.ReactNode` | — | Subtree that can use `useNotification` |

### useNotification — notify function

Call the hook inside a component under `Notifications`:

```tsx
const notify = useNotification();
const subscription = notify("Saved", { theme: "success" });
```

**Parameters**

| Parameter | Type | Description |
|---|---|---|
| `message` | `Label` | Notification body (string or React node) |
| `options` | `NotificationOptions` | Optional configuration |

**NotificationOptions**

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Stable ID; a toast with this ID updates instead of duplicating |
| `title` | `Label` | — | Optional notification title |
| `theme` | `NotificationTheme` | `"default"` | Visual theme variant |
| `timeout` | `number` | Provider default | Auto-dismiss time in ms; `0` disables automatic dismissal |
| `closable` | `boolean` | `true` | Shows a close button unless `loading` is true; swipe and Escape still dismiss |
| `loading` | `boolean` | `false` | Shows a loading icon, hides the close button; timeout unchanged |

**Return value — `NotificationSubscriber`**

| Method | Description |
|---|---|
| `close` | Dismiss this notification |
| `clear` | Dismiss all visible notifications |

## Themes

| Value | Appearance |
|---|---|
| `"default"` | Card background with foreground text |
| `"info"` | `bg-alert-info-bg` / `text-alert-info-text` / `border-alert-info-border` |
| `"success"` | `bg-alert-success-bg` / `text-alert-success-text` / `border-alert-success-border` |
| `"warn"` | `bg-alert-warn-bg` / `text-alert-warn-text` / `border-alert-warn-border` |
| `"danger"` | `bg-alert-danger-bg` / `text-alert-danger-text` / `border-alert-danger-border` |
| `"secondary"` | `bg-alert-secondary-bg` / `text-alert-secondary-text` / `border-alert-secondary-border` |
| `"muted"` | `bg-alert-muted-bg` / `text-alert-muted-text` / `border-alert-muted-border` |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

| Override | Library default |
|---|---|
| `--var-notification-surface-radius` | `var(--var-radius-base)` |
| `--var-notification-surface-backdrop-blur` | `calc( var(--var-spacing-base) * 0.75 )` |
| `--var-notification-content-gap` | `calc(var(--var-spacing-base) * 0.75)` |
| `--var-notification-content-padding` | `calc(var(--var-spacing-base) * 1)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-card-background` | `--var-card-background` | Card background utility; default notifications use `--var-color-background` |
| `border-card-border` | `--var-card-border` | Card border utility; default notifications use `--var-color-border` |
| `text-foreground` | `--var-color-foreground` | Default notification text |
| `bg-alert-{theme}-bg` | `--var-alert-{theme}-background` | Background for `info`, `warn`, `danger`, `success` |
| `text-alert-{theme}-text` | `--var-alert-{theme}-foreground` | Text for `info`, `warn`, `danger`, `success` |
| `border-alert-{theme}-border` | `--var-alert-{theme}-border` | Border for `info`, `warn`, `danger`, `success` |
| `bg-alert-muted-bg` | `--var-color-muted` | Muted background |
| `text-alert-muted-text` | `--var-color-muted-foreground` | Muted text |
| `border-alert-muted-border` | `--var-color-border` | Muted border |

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

- Set `theme` to match severity (`success`, `danger`, `warn`).
- Keep messages short but complete. Do not put long or essential instructions only in a toast.
- Use `title` for a concise description of the result.
- Set `timeout: 0` for an operation update that must not expire.
- Put critical errors and recovery actions in persistent task content, not only in a toast.
- Set `loading: true` for in-progress operations.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`). Use `theme`.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't use notifications for information that needs acknowledgment before proceeding. Use a `Modal`.
- Don't show more than 3–5 notifications at a time. Set `max` accordingly.
- Don't use notifications for persistent status. Use `Alert` or a status bar.

## Interaction design and acceptance criteria

- Use `Notifications` for brief, non-blocking feedback after an action.
- State the outcome in text. Do not depend on theme or icon.
- Put critical failures, mandatory decisions, destructive confirmation, and information needed later in persistent task content: [Alert](Alert.md) or [Modal](Modal.md). Do not rely on the toast stack alone.
- Provider `timeout` defaults to 5000 ms.
- `timeout: 0` disables automatic dismissal in the current Base UI dependency. `Infinity` goes to timers and is not a persistence flag.
- `loading` only changes the icon and hides close. Set a timeout policy explicitly.
- `closable: false` hides the button. Right-swipe and Escape on a focused toast still dismiss.
- A non-expiring toast can be hidden by stack limits or cleared programmatically. It is not durable storage.
- Do not move task focus to show feedback.
- Base UI supplies a polite Notifications region, keyboard-focusable toast roots, F6 access to the viewport, and timer pause/resume on hover and keyboard focus.
- Themes do not set announcement urgency. This wrapper has no priority or live-region option.
- Verify announcements, timing, and focus after update or dismissal in the integrated application. Do not assume assistive-technology delivery.
- Current limits: the built-in close button has a decorative icon and no accessible name. `NotificationOptions` has no close-label override.
- Current limits: component CSS defines hover feedback, not a close-button focus-visible rule.
- Give consumer actions clear names with `Button` controls. This does not fix the built-in close control. A clearly named close button remains an unmet target.
- Without hover, the custom stack renders three toasts. On hover, it renders up to `max`.
- The `+N more` badge is non-interactive. Keyboard focus does not expand the custom slice.
- Do not rely on hover-only messages for recovery or actions.
- Titles use single-line ellipsis. The text container hides overflow. Descriptions carry a two-line-clamp class.
- Verify complete essential wording, reading order, touch dismissal, and unobstructed task and virtual-keyboard controls at 200% text size and a 320 CSS-pixel viewport.

## Verification

Acceptance criteria for tests and reviews: [verify/Notifications.md](verify/Notifications.md).

## Accessibility

- Base UI Toast handles live-region and focus behavior. The installed primitive uses a polite region. This wrapper has no announcement priority option.
- Toast roots and close buttons use the primitive's keyboard behavior. Escape closes a toast that contains focus.
- `swipeDirection="right"` enables right-swipe dismissal, even when the close button is hidden.
- Timer pause/resume and focus restoration come from the dependency. Verify them in integration, especially when the hover-only stack slice removes items.

## Notes

- By default 3 notifications are visible. Hover on the stack shows all, up to `max`.
- Animations use Framer Motion (`motion/react`) with spring physics for enter and exit.
- The viewport is centered at the top with `--var-notification-viewport-inset-block-start` and `--var-layer-floating`. It has no hardcoded z-index.
- When the hover-limited slice holds more toasts, a `+N more` badge shows that slice's hidden count. It is not an expander. It does not count every toast beyond `max`.
