---
title: TaskList
description: Fieldset container with a reduced-motion-aware celebration when all child tasks are checked.
package: "@g4rcez/components"
export: "{ TaskList }"
import: "import { TaskList } from '@g4rcez/components/task-list'"
category: form
---

# TaskList

Fieldset container that triggers a celebratory animation when all child tasks are checked. The scale/rotation sequence is skipped when reduced motion is preferred. Task state does not change.

## Import

```tsx
import { TaskList } from "@g4rcez/components/task-list";
import { Checkbox } from "@g4rcez/components/checkbox";
```

## Props

Accepts all standard HTML `<fieldset>` attributes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | `Checkbox` components with the `asTask` prop. |
| `className` | `string` | — | Extra CSS classes for the `<fieldset>`. |

## Design Tokens

`TaskList` is a plain `<fieldset>`. It inherits ambient tokens from its children and consumes no component-scoped tokens. Style the container with semantic tokens:

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `border-border` | `--var-color-border` | Optional task group border color |
| `bg-background` | `--var-color-background` | Optional container background |
| `text-foreground` | `--var-color-foreground` | Optional task label text color |

## Examples

### Basic task list

```tsx
import { TaskList } from "@g4rcez/components/task-list";
import { Checkbox } from "@g4rcez/components/checkbox";
export default function OnboardingChecklist() {
    return (
        <TaskList className="flex flex-col gap-sm border border-border rounded-card-radius p-4">
            {" "}
            <Checkbox asTask>Complete initial setup</Checkbox> <Checkbox asTask>Upload profile picture</Checkbox>{" "}
            <Checkbox asTask>Verify email address</Checkbox>{" "}
        </TaskList>
    );
}
```

### Dynamic tasks from state

```tsx
import { useState } from "react";
import { TaskList } from "@g4rcez/components/task-list";
import { Checkbox } from "@g4rcez/components/checkbox";
type Task = { id: string; text: string; done: boolean };
export default function DynamicTaskList({ tasks }: { tasks: Task[] }) {
    const [items, setItems] = useState(tasks);
    const toggle = (id: string) => setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    return (
        <TaskList className="flex flex-col gap-sm">
            {" "}
            {items.map((task) => (
                <Checkbox key={task.id} asTask checked={task.done} onChange={() => toggle(task.id)}>
                    {" "}
                    {task.text}{" "}
                </Checkbox>
            ))}{" "}
        </TaskList>
    );
}
```

### Grouped tasks with a legend

```tsx
import { TaskList } from "@g4rcez/components/task-list";
import { Checkbox } from "@g4rcez/components/checkbox";
export default function ProjectSubtasks() {
    return (
        <TaskList className="flex flex-col gap-sm rounded-card-radius border border-border p-4">
            {" "}
            <legend className="px-1 text-sm font-medium text-foreground">Phase 1 — Design</legend> <Checkbox asTask>Create wireframes</Checkbox>{" "}
            <Checkbox asTask>Review with stakeholders</Checkbox> <Checkbox asTask>Export design tokens</Checkbox>{" "}
        </TaskList>
    );
}
```

## Do

- Use `asTask` on every `Checkbox` inside `TaskList`, so the completion animation counts it.
- Group closely related tasks. The animation fits best when all items belong to one milestone.
- Space items vertically (`gap-sm`, `gap-base`).
- Use design-token classes for wrappers (`bg-background`, `border-border`, `rounded-card-radius`).

## Don't

- Don't use `TaskList` for checkboxes that are not tasks (for example, bulk-selection rows in a table).
- Don't put many unrelated tasks in one list. Split them into smaller groups.
- Don't pass raw utility color classes (`bg-gray-100`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Interaction design and acceptance criteria

`TaskList` composes `Checkbox`. These are integration checks and consumer targets, not executed accessibility tests.

- Use `TaskList` for related completion tasks with a shared milestone. Do not use it for bulk selection or an immediate binary setting.
- Compose [Checkbox](Checkbox.md) with `asTask`, supply a `legend`, and keep each task label clear.
- Consumers decide whether progress is local, persisted immediately, or submitted later. The wrapper does not save or manage task state.
- `Checkbox` provides pointer/touch activation of each label and Tab/Shift+Tab/Space interaction.
- A checked task gains strikethrough. The native checked state remains the semantic completion signal.
- Keep label targets comfortably spaced. Verify keyboard focus in the full list.
- The wrapper checks completion on bubbling `change` events from marked task inputs.
- When all `input[data-task=true]` descendants are checked, the wrapper animates inputs unless reduced motion is preferred.
- Changing React state or `checked` props alone does not run this listener.
- Disabled marked tasks count toward completion.
- **Current limits:** no progress count, completion callback, aggregate mixed-state checkbox, live completion announcement, or automatic focus movement.
- The animation selects all inputs inside the wrapper, not only marked tasks. Keep unrelated form fields outside it.
- Consumers provide any nonvisual completion/status message, without duplicating individual checked-state feedback.
- Verify actual announcements with supported assistive technologies.

## Accessibility

- Renders a semantic `<fieldset>`. Consumers supply a `<legend>` to name the task group.
- Each `Checkbox asTask` keeps its native name, checked state, keyboard handling, and error description.
- The completion animation is visual-only. It adds no live completion message or focus-management action.

## Data Attributes

| Attribute | Element | Value | Description |
| --- | --- | --- | --- |
| `data-component` | `fieldset` | `"task-list"` | Identifies the component. |
| `data-task` | child `input` | `"true"` | Required on child checkbox inputs for the completion check. `asTask` sets it automatically. |

## Notes

- `motion/react` powers the animation. When all `input[data-task=true]` elements in the fieldset are checked, a staggered scale + rotate animation fires from the last-checked item's index, unless reduced motion is preferred.
- `TaskList` attaches one `change` listener on the `<fieldset>` (event delegation). No per-item wiring is needed.
- Any delegated task change that finds all marked task inputs checked can trigger the animation. There is no one-shot guard. Unchecking and rechecking can replay it.

## Verification

Acceptance criteria for tests and reviews: [verify/TaskList.md](verify/TaskList.md).
