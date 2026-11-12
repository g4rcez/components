---
title: Modal
description: Animated modal with dialog, drawer, and sheet variants; includes drag-to-resize and a programmatic confirm utility.
package: "@g4rcez/components"
export: "{ Modal, ModalConfirmProvider, useConfirm }"
import: "import { Modal } from '@g4rcez/components/modal'"
category: floating
---

# Modal

Animated modal with dialog, drawer, and sheet variants, drag-to-resize, and a programmatic confirm utility.

## Import

```tsx
import { Modal, ModalConfirmProvider, useConfirm } from "@g4rcez/components/modal";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Modal visibility |
| `onChange` | `(nextState: boolean) => void` | — | Called when modal state changes |
| `title` | `React.ReactNode` | — | Modal title; renders an `<h2>` header |
| `ariaTitle` | `string` | — | ARIA label when no visible `title` exists |
| `ariaDescription` | `string` | — | Accessible description of the modal content |
| `footer` | `React.ReactNode` | — | Footer content |
| `type` | `"dialog" \| "drawer" \| "sheet"` | `"dialog"` | Modal variant |
| `position` | `"left" \| "right"` | `"right"` | Drawer slide-in side; drawer type only |
| `animated` | `boolean` | `true` | Enable enter and exit animations |
| `closable` | `boolean` | `true` | Show the close button; Escape and sheet drag still dismiss |
| `resizer` | `boolean` | `true` | Show the drag-to-resize handle (drawer and sheet) |
| `forceType` | `boolean` | `false` | Keep `type` on all screen sizes |
| `overlayClickClose` | `boolean` | `false` | Close on backdrop click |
| `closeOnFocusOut` | `boolean` | `false` | Close when focus leaves the modal |
| `trigger` | `React.ReactNode \| React.FC` | — | Element that toggles the modal on click |
| `asChild` | `boolean` | `false` | Merge trigger props onto the child element via `Slot` |
| `className` | `string` | — | Extra classes for the modal surface |
| `bodyClassName` | `string` | — | Extra classes for the scrollable body |
| `overlayClassName` | `string` | — | Extra classes for the backdrop overlay |
| `layoutId` | `string` | — | Framer Motion layout ID for shared-element transitions |
| `role` | `"dialog" \| "alertdialog"` | `"dialog"` | ARIA role |
| `interactions` | `ElementProps[]` | — | Extra Floating UI interaction hooks |
| `initialFocus` | `number \| React.MutableRefObject<HTMLElement \| null>` | — | Initial focus target passed to Floating UI |

### Types

| Type | Behavior | Best for |
|---|---|---|
| `dialog` | Centered overlay with backdrop | Confirmations, forms |
| `drawer` | Slides in from left or right; full height | Navigation, detail panels |
| `sheet` | Slides up from bottom; full width | Mobile action sheets |

- Below `64rem`, `dialog` and `drawer` become `sheet`. Set `forceType={true}` to prevent this.
- `sheet` stays `sheet`.
- Sheets use the iOS sheet curve (`cubic-bezier(0.32, 0.72, 0, 1)`): 0.5s in, 0.32s out, with the backdrop on the same timing. `prefers-reduced-motion` is respected.
- While a sheet is open it lifts above the on-screen keyboard. `useKeyboardInset` publishes the covered height as `--var-keyboard-inset` on `<html>` (from `window.visualViewport`), and the sheet translates and shrinks with it so its top stays on screen. The focused field is scrolled into view once the keyboard settles. Apps can read the same variable, or call `useKeyboardInset(enabled)`, for their own fixed bottom bars.
- `MODAL_DESKTOP_QUERY` (`"(min-width: 64rem)"`) is the breakpoint where a Modal stops being a sheet. Reuse it to match the switch.

## Design Tokens

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-modal-surface-min-inline-size` | `calc(var(--var-spacing-base) * 20)` |
| `--var-modal-surface-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-modal-dialog-max-block-size` | `calc(var(--var-spacing-base) * 40)` |
| `--var-modal-surface-radius` | `var(--var-radius-base)` |
| `--var-modal-surface-overflow` | `visible` |
| `--var-motion-timing-sheet` | `cubic-bezier(0.32, 0.72, 0, 1)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-floating-background` | `--var-dropdown-surface-background` | Dropdown background utility; modal surface uses `--var-color-background` |
| `border-floating-border` | `--var-dropdown-surface-border` | Dropdown border utility; modal borders, dividers, resizer use `--var-color-border` |
| `bg-floating-overlay` | `--var-modal-overlay-background` | Backdrop color, including its token-defined alpha |
| `z-overlay` | `--var-layer-overlay` | Z-index of the backdrop |
| `z-floating` | `--var-layer-floating` | Z-index of the modal surface and close button |
| `w-dialog` | `--var-spacing-dialog` | Dialog width utility; not a default modal max-width |
| `text-foreground` | `--var-color-foreground` | Body text color |
| `text-danger` | `--var-color-danger` | Close button hover color |

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

`closable={false}` hides only the visible Close button. Escape still requests `onChange(false)`. Sheet drag gestures also request dismissal. Handle these requests in the owning state. This example is not an undismissable modal.

### Programmatic Confirm Dialog

Wrap the app with `ModalConfirmProvider` once. `ComponentsProvider` already mounts it.

```tsx
import { ModalConfirmProvider } from "@g4rcez/components/modal";
export default function App({ children }) {
    return <ModalConfirmProvider>{children}</ModalConfirmProvider>;
}
```

After the provider mounts and its effect registers the handler, call `Modal.confirm`:

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

Or call the `useConfirm` hook inside a `ModalConfirmProvider` subtree:

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

- Choose the `type` (`dialog`, `drawer`, `sheet`) that fits the content and context.
- Use `<Modal type="dialog" />` by default. Use `drawer` or `sheet` only when the layout requires it.
- Set `title` or `ariaTitle` so screen readers announce the modal.
- Put action buttons in `footer`, separate from body content.

## Don't

- Don't pass custom `z-*`, `rounded-*`, or `p-*` overrides. Use `type` to control layout variants.
- Don't use raw utility color classes (`bg-blue-500`, `text-white`, `bg-gray-100`). Use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`, `z-[9999]`). Override CSS variables in your `@theme` block.
- Don't use `color-mix` in `className` or `style` props.
- Don't nest modals. Nested modals break focus and z-index.
- Don't set `closable={false}` without another way to close the modal.

## Accessibility

- `FloatingFocusManager` uses modal focus management and guards. Set `initialFocus` to choose the entry point. Verify containment and focus return in the consuming application.
- Escape requests `onChange(false)` even when `closable={false}`. Controlled visibility changes only when the parent updates `open`.
- A visible `title` supplies `aria-labelledby`. Without it, `ariaTitle` supplies `aria-label`.
- `ariaDescription` references a visually hidden description, not the whole interactive body.
- `aria-modal="true"` is set on the floating surface for `dialog` and `alertdialog`. No nonmodal mode exists.
- The open overlay locks body scrolling. Verify that background content is unavailable to the application's assistive technologies and nested portals.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use a modal only for a task or decision that justifies interrupting the flow.
- Give the opener a purpose-specific name. Give the dialog a visible title or `ariaTitle`. Use distinct action and cancel labels.
- Use `role="alertdialog"` only for an immediate message that needs a response.
- All three variants are modal. Changing `type` or `closeOnFocusOut` does not give the nonmodal-dialog branch of the source pattern. Both keep modal focus management and `aria-modal`.
- The built-in trigger is a button. It exposes expanded state and controls the open dialog.
- Use `asChild` with an existing named `Button` to avoid a button inside a button.
- A separate opener MUST update `open` and set its own name and state relationships.
- Outside press does not close by default. Set `overlayClickClose` to enable it.
- Escape, the visible Close button, and applicable sheet gestures request closing through `onChange`.
- No built-in unsaved-data confirmation exists. Hiding the Close button does not disable other dismissal paths.
- `Modal.confirm` and `useConfirm` need a mounted provider.
- Before any provider registers, `Modal.confirm` resolves `false`, shows no dialog, and warns in the browser.
- `useConfirm` outside provider context also resolves `false`.
- The provider renders an `alertdialog`, focuses Confirm, and resolves Cancel and Escape to `false` by default.
- To focus Cancel or explanatory content first on a destructive decision, use a declarative `Modal` with a suitable `initialFocus`.

**Consumer responsibilities and design targets**

- Choose a safe initial focus.
- Keep a reachable, visible cancel or close action.
- Handle every close request before discarding entered data.
- Verify Tab and Shift+Tab containment, background unavailability, and focus return when the opener disappears.
- After conversion to a sheet, check touch targets, scrolling, zoom, and virtual-keyboard visibility.
- Add concise descriptions when they help a decision. Verify real announcements. Do not assume the whole body is announced.
- Mount one confirmation provider. Do not overlap confirm requests: the provider stores one options object and one resolver, not a queue.

## Data Attributes

| Attribute | Applied to | Description |
|---|---|---|
| `data-component="modal"` | Modal surface `<div>` | Identifies the modal root |
| `data-component="modal-body"` | Scrollable body `<section>` | Identifies the content area |

## Notes

- `resizer` adds a named, keyboard-focusable drag handle: horizontal for drawers, vertical for sheets.
- Arrow keys resize in bounded steps.
- A sheet handle requests closing below 60% of its 90%-viewport maximum.
- The draggable sheet header uses a separate threshold based on `window.outerHeight`.
- Hiding `resizer` does not disable header dragging.
- `layoutId` enables Framer Motion shared-element transitions between a trigger and the modal surface.
- Shared surfaces omit the separate dialog, drawer, and sheet entrance transform and fade. Their source geometry drives the morph. `transition.layout` customizes the timing.
- `ModalConfirmProvider` installs a module-level confirmation handler. `ComponentsProvider` already includes one.
- Call `Modal.confirm` only while that provider is mounted. Do not overlap requests.
- Unmounting does not reset the global handler. Calls after unmount are unsupported: do not assume they resolve.
- The confirm dialog uses `--var-modal-confirm-dialog-max-inline-size` (fallback `calc(var(--var-spacing-base) * 24)`).
- Clicking the overlay does not close the confirm dialog. Its Cancel action and Escape stay available.

## Verification

Acceptance criteria for tests and reviews: [verify/Modal.md](verify/Modal.md).
