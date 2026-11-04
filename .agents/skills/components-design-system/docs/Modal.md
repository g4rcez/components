---
title: Modal
description: Animated modal with dialog, drawer, and sheet variants; includes drag-to-resize and a programmatic confirm utility.
package: "@g4rcez/components"
export: "{ Modal, ModalConfirmProvider, useConfirm }"
import: "import { Modal } from '@g4rcez/components/modal'"
category: floating
---

# Modal

Animated modal with dialog, drawer, and sheet variants; includes drag-to-resize and a programmatic confirm utility.

## Import

```tsx
import { Modal, ModalConfirmProvider, useConfirm } from "@g4rcez/components/modal";
```

## Props

| Prop                | Type                                                    | Default    | Description                                                            |
| ------------------- | ------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `open`              | `boolean`                                               | —          | Controls modal visibility                                              |
| `onChange`          | `(nextState: boolean) => void`                          | —          | Callback when modal state changes                                      |
| `title`             | `React.ReactNode`                                       | —          | Modal title; creates a `<h2>` header                                   |
| `ariaTitle`         | `string`                                                | —          | ARIA label used when no visible `title` is provided                    |
| `ariaDescription`   | `string`                                                | —          | Accessible description for the modal content                           |
| `footer`            | `React.ReactNode`                                       | —          | Footer content                                                         |
| `type`              | `"dialog" \| "drawer" \| "sheet"`                       | `"dialog"` | Modal display variant                                                  |
| `position`          | `"left" \| "right"`                                     | `"right"`  | Drawer slide-in side (drawer type only)                                |
| `animated`          | `boolean`                                               | `true`     | Enable enter/exit animations                                           |
| `closable`          | `boolean`                                               | `true`     | Show the close button; does not disable Escape or sheet drag dismissal |
| `resizer`           | `boolean`                                               | `true`     | Show the drag-to-resize handle (drawer and sheet)                      |
| `forceType`         | `boolean`                                               | `false`    | Disable responsive behavior — keep `type` on all screen sizes          |
| `overlayClickClose` | `boolean`                                               | `false`    | Close when clicking the backdrop                                       |
| `closeOnFocusOut`   | `boolean`                                               | `false`    | Close when focus leaves the modal                                      |
| `trigger`           | `React.ReactNode \| React.FC`                           | —          | Element that toggles the modal when clicked                            |
| `asChild`           | `boolean`                                               | `false`    | Merge trigger props onto the child element via `Slot`                  |
| `className`         | `string`                                                | —          | Additional classes for the modal surface                               |
| `bodyClassName`     | `string`                                                | —          | Additional classes for the scrollable body                             |
| `overlayClassName`  | `string`                                                | —          | Additional classes for the backdrop overlay                            |
| `layoutId`          | `string`                                                | —          | Framer Motion layout ID for shared-element transitions                 |
| `role`              | `"dialog" \| "alertdialog"`                             | `"dialog"` | ARIA role                                                              |
| `interactions`      | `ElementProps[]`                                        | —          | Extra Floating UI interaction hooks                                    |
| `initialFocus`      | `number \| React.MutableRefObject<HTMLElement \| null>` | —          | Initial focus target passed to Floating UI                             |

### Types

| Type     | Behavior                                  | Best for                  |
| -------- | ----------------------------------------- | ------------------------- |
| `dialog` | Centered overlay with backdrop            | Confirmations, forms      |
| `drawer` | Slides in from left or right; full height | Navigation, detail panels |
| `sheet` | Slides up from bottom; full width | Mobile action sheets |

Below `64rem`, both dialogs and drawers become sheets unless `forceType` is set. Sheets remain sheets.

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                              | Library default                           |
| ------------------------------------- | ----------------------------------------- |
| `--var-modal-surface-min-inline-size` | `calc(var(--var-spacing-base) * 20)`      |
| `--var-modal-surface-gap`             | `calc(var(--var-spacing-base) * 1)`       |
| `--var-modal-dialog-max-block-size`   | `calc(var(--var-spacing-base) * 40)`      |
| `--var-modal-surface-radius`          | `calc(var(--var-radius-base) * 1.333333)` |

| Token | CSS Variable             | Purpose                             |
| ------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `bg-floating-background` | `--var-dropdown-surface-background` | Dropdown background utility; the modal surface uses `--var-color-background`           |
| `border-floating-border` | `--var-dropdown-surface-border`     | Dropdown border utility; modal borders, dividers, and resizer use `--var-color-border` |
| `bg-floating-overlay`    | `--var-modal-overlay-background`    | Backdrop color, including its token-defined alpha                                      |
| `z-overlay`              | `--var-layer-overlay`               | Z-index of the backdrop                                                                |
| `z-floating`             | `--var-layer-floating`              | Z-index of the modal surface and close button                                          |
| `w-dialog`               | `--var-spacing-dialog`              | Dialog width utility; not a default modal max-width                                    |
| `text-foreground`        | `--var-color-foreground`            | Body text color                                                                        |
| `text-danger`            | `--var-color-danger`                | Close button hover color                                                               |

## Examples

### Basic Dialog

```tsx
import { useState } from "react";
import { Modal } from "@g4rcez/components/modal";
import { Button } from "@g4rcez/components/button";
function BasicDialog() {
    const [open, setOpen] = useState(false);
    return (
        <>
            {" "}
            <Button onClick={() => setOpen(true)}>Open Dialog</Button>{" "}
            <Modal open={open} onChange={setOpen} title="Confirm Action">
                {" "}
                <p className="text-foreground">Are you sure you want to proceed?</p>{" "}
                <div className="flex gap-2 mt-4">
                    {" "}
                    <Button theme="ghost-muted" onClick={() => setOpen(false)}>
                        {" "}
                        Cancel{" "}
                    </Button>{" "}
                    <Button theme="danger" onClick={() => setOpen(false)}>
                        {" "}
                        Confirm{" "}
                    </Button>{" "}
                </div>{" "}
            </Modal>{" "}
        </>
    );
}
```

### With Footer

```tsx
<Modal
    open={open}
    onChange={setOpen}
    title="User Profile"
    footer={
        <div className="flex justify-end gap-2">
            {" "}
            <Button theme="ghost-muted" onClick={() => setOpen(false)}>
                {" "}
                Cancel{" "}
            </Button>{" "}
            <Button theme="primary">Save Changes</Button>{" "}
        </div>
    }
>
    {" "}
    <form className="space-y-4">
        {" "}
        <div>
            {" "}
            <label className="text-sm font-medium text-foreground">Name</label>{" "}
            <input type="text" className="w-full p-2 rounded-button-radius border border-border bg-background text-foreground" />{" "}
        </div>{" "}
    </form>
</Modal>
```

### Drawer

```tsx
<Modal open={open} onChange={setOpen} type="drawer" position="right" title="Navigation">
    {" "}
    <nav className="space-y-2">
        {" "}
        <a href="/dashboard" className="block rounded-button-radius p-2 text-foreground hover:bg-muted">
            {" "}
            Dashboard{" "}
        </a>{" "}
        <a href="/profile" className="block rounded-button-radius p-2 text-foreground hover:bg-muted">
            {" "}
            Profile{" "}
        </a>{" "}
        <a href="/settings" className="block rounded-button-radius p-2 text-foreground hover:bg-muted">
            {" "}
            Settings{" "}
        </a>{" "}
    </nav>
</Modal>
```

### Sheet

```tsx
<Modal open={open} onChange={setOpen} type="sheet" title="Quick Actions">
    {" "}
    <div className="grid grid-cols-2 gap-4">
        {" "}
        <Button theme="ghost-neutral" className="flex-col h-24">
            {" "}
            Analytics{" "}
        </Button>{" "}
        <Button theme="ghost-neutral" className="flex-col h-24">
            {" "}
            Revenue{" "}
        </Button>{" "}
    </div>
</Modal>
```

### With Built-in Trigger

```tsx
<Modal open={open} onChange={setOpen} title="Settings" asChild trigger={<Button theme="primary">Open Settings</Button>}>
    {" "}
    <p className="text-foreground">Settings content here.</p>
</Modal>
```

### Processing Modal with Hidden Close Button

```tsx
<Modal open={open} onChange={setOpen} title="Processing..." closable={false}>
    {" "}
    <div className="text-center text-foreground">
        {" "}
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />{" "}
        <p>Please wait while we process your request.</p>{" "}
    </div>
</Modal>
```

`closable={false}` hides only the visible Close button. Escape still requests `onChange(false)`, and sheet drag gestures can also request dismissal. Handle these requests safely in the owning state; this example is not an undismissable modal.

### Programmatic Confirm Dialog

Wrap your app with `ModalConfirmProvider` once, or use `ComponentsProvider`, which already mounts it:

```tsx
import { ModalConfirmProvider } from "@g4rcez/components/modal";
export default function App({ children }) {
    return <ModalConfirmProvider>{children}</ModalConfirmProvider>;
}
```

After the provider is mounted and its effect has registered the handler, call `Modal.confirm`:

```tsx
import { Modal } from "@g4rcez/components/modal";

async function handleDelete() {
    const confirmed = await Modal.confirm({
        title: "Delete item",
        description: "This action cannot be undone.",
        confirm: { text: "Delete", theme: "danger" },
        cancel: { text: "Cancel" },
    });

    if (confirmed) {
        await deleteItem();
    }
}
```

Or use the `useConfirm` hook inside a `ModalConfirmProvider` subtree:

```tsx
import { useConfirm } from "@g4rcez/components/modal";

function DeleteButton() {
    const confirm = useConfirm();
    const handleClick = async () => {
        const ok = await confirm({ title: "Delete item", description: "Are you sure?" });
        if (ok) await deleteItem();
    };

    return (
        <Button theme="danger" onClick={handleClick}>
            Delete
        </Button>
    );
}
```

## Do

- Choose the correct `type` (`dialog`, `drawer`, `sheet`) for the content and context.
- Use `<Modal type="dialog" />` as the default — only switch to `drawer` or `sheet` when layout demands it.
- Always provide either `title` or `ariaTitle` so screen readers can announce the modal.
- Use `footer` for action buttons to keep them separated from body content.

## Don't

- Don't pass custom `z-*`, `rounded-*`, or `p-*` overrides directly — use `type` to control layout variants.
- Don't use raw utility color classes (`bg-blue-500`, `text-white`, `bg-gray-100`) — use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`, `z-[9999]`) — override CSS variables in your `@theme` block.
- Don't use `color-mix` in `className` or `style` props.
- Don't nest modals inside each other — it creates broken focus and z-index behavior.
- Don't hide a modal's only close affordance (`closable={false}`) without providing another way to close.

## Accessibility

- `FloatingFocusManager` is configured with modal focus management and guards. Use `initialFocus` for an appropriate entry point, and verify containment and focus return in the consuming application.
- Escape requests `onChange(false)` even when `closable={false}`. Controlled visibility changes only when the parent updates `open`.
- A visible `title` supplies `aria-labelledby`; otherwise `ariaTitle` supplies `aria-label`. `ariaDescription` references a visually hidden description, not the complete interactive body.
- `aria-modal="true"` is applied to the floating surface for both `dialog` and `alertdialog` roles; there is no nonmodal mode.
- The open overlay locks body scrolling. Verify that background content is unavailable through the application's assistive technologies and any nested portals.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use a modal only for a task or decision that warrants interrupting the current flow. Give the opener a purpose-specific name, the dialog a visible title or `ariaTitle`, and distinct action/cancel labels. Reserve `role="alertdialog"` for an immediate message requiring a response.

- All three visual variants are modal. 's nonmodal-dialog branch is not provided by changing `type` or `closeOnFocusOut`; those options retain modal focus management and `aria-modal`.
- The built-in trigger is a button. Use `asChild` with an existing named `Button` so it is not nested inside another button. It exposes expanded state and controls the open dialog. A separate opener must update `open` and provide its own suitable naming/state relationships.
- Outside press does not close by default; `overlayClickClose` opts into it. Escape, the visible Close button, and applicable sheet gestures request closing through `onChange`. There is no built-in unsaved-data confirmation, and hiding the Close button does not disable other dismissal paths.
- Displaying confirmation through `Modal.confirm` or `useConfirm` requires a mounted provider. Before any provider registers, `Modal.confirm` resolves `false` without a dialog and warns in the browser; `useConfirm` outside provider context also resolves `false`. The provider renders an `alertdialog`, focuses Confirm, and resolves Cancel/Escape to `false` by default. Use a declarative `Modal` with an appropriate `initialFocus` when a destructive decision should initially focus Cancel or explanatory content. **Consumer responsibilities and design targets** Choose safe initial focus, keep a reachable visible cancel/close action, and handle every close request before discarding entered data. Verify Tab/Shift+Tab containment, background unavailability, and focus return when the opener disappears. Check touch targets, scrolling, zoom, and virtual-keyboard visibility after responsive conversion to a sheet. Supply concise descriptions when they help a decision; verify actual announcements rather than assuming the entire body is announced. Mount one confirmation provider and avoid overlapping confirm requests: it stores one options object and resolver, not a queue. **Acceptance criteria — verify in the consuming application** 1. **Given** a closed controlled dialog with a named `Button` trigger and `asChild`, **when** click, tap, Enter, or Space activates it, **then** `onChange(true)` is requested and the updated `open` exposes the named dialog and expanded trigger state.

2. **Given** an open modal, **when** Tab and Shift+Tab traverse its controls, **then** focus remains visibly inside, the initial target suits the task, and background interaction is unavailable; verify keyboard and assistive-technology navigation separately.
3. **Given** a dialog with unsaved data, **when** Escape, Close, an enabled outside press, or a sheet drag requests dismissal, **then** the consumer applies the same data-loss policy before changing `open`; `closable={false}` alone does not prevent dismissal.
4. **Given** a dialog that has closed, **when** the user continues navigating, **then** focus returns to the opener or an explicitly chosen logical successor, including when the original opener was removed.
5. **Given** a mounted confirmation provider and one pending request, **when** Confirm, Cancel, or Escape is activated, **then** the promise resolves to the configured action value (default `true` / `false`) and the dialog closes; before any provider has registered, `Modal.confirm` instead returns `false` without opening a dialog.

## Data Attributes

| Attribute                     | Applied to                  | Description                 |
| ----------------------------- | --------------------------- | --------------------------- |
| `data-component="modal"`      | Modal surface `<div>`       | Identifies the modal root   |
| `data-component="modal-body"` | Scrollable body `<section>` | Identifies the content area |

## Notes

- Dialogs and drawers auto-switch to sheets on viewports narrower than `64rem` unless `forceType={true}`.
- `resizer` adds a named keyboard-focusable drag handle: horizontal for drawers, vertical for sheets. Arrow keys resize in bounded steps. A sheet handle requests closing below 60% of its 90%-viewport maximum; the draggable sheet header has a separate threshold based on `window.outerHeight`. Hiding `resizer` does not disable header dragging.
- `layoutId` enables Framer Motion shared-element transitions between a trigger and the modal surface. Shared surfaces omit the separate dialog/drawer/sheet entrance transform and fade so their source geometry drives the morph; `transition.layout` can customize its timing.
- `ModalConfirmProvider` installs a module-level confirmation handler; `ComponentsProvider` already includes one. Call the imperative utility only while that provider is mounted, and avoid overlapping requests. Unmounting does not reset the global handler, so calls after unmount are unsupported and must not be assumed to resolve.
- The confirm dialog uses `--var-modal-confirm-dialog-max-inline-size` (fallback `calc(var(--var-spacing-base) * 24)`) and cannot be closed by clicking the overlay. Its Cancel action and Escape remain available.
