---
title: TaskList
description: Fieldset container with a reduced-motion-aware celebration when all child tasks are checked.
package: "@g4rcez/components"
export: "{ TaskList }"
import: "import { TaskList } from '@g4rcez/components/task-list'"
category: form
---

# TaskList

Fieldset container that triggers a celebratory animation when all child tasks are checked. Its scale/rotation sequence is skipped when reduced motion is preferred; task state is unchanged.

## Import

```tsx
import { TaskList } from "@g4rcez/components/task-list";
import { Checkbox } from "@g4rcez/components/checkbox";
```

## Props

Accepts all standard HTML `<fieldset>` attributes.

| Prop        | Type              | Default | Description                                   |
| ----------- | ----------------- | ------- | --------------------------------------------- |
| `children`  | `React.ReactNode` | —       | `Checkbox` components with the `asTask` prop. |
| `className` | `string`          | —       | Additional CSS classes for the `<fieldset>`.  |

## Design Tokens

`TaskList` itself is a plain `<fieldset>` and inherits ambient tokens from its children. No component-scoped tokens are consumed directly. Style the container using semantic tokens:

| Token | CSS Variable      | Purpose                  |
| ----------------- | ------------------------ | -------------------------------- |
| `border-border`   | `--var-color-border`     | Optional task group border color |
| `bg-background`   | `--var-color-background` | Optional container background    |
| `text-foreground` | `--var-color-foreground` | Optional task label text color   |

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

- Use `asTask` on every `Checkbox` inside `TaskList` so they are counted for the completion animation.
- Group closely related tasks — the animation is most meaningful when all items belong to one milestone.
- Provide adequate vertical spacing between items (`gap-sm`, `gap-base`) for readability.
- Use design-token classes for wrappers (`bg-background`, `border-border`, `rounded-card-radius`).

## Don't

- Don't use `TaskList` for checkboxes that are not tasks (e.g., bulk-selection rows in a table).
- Don't pack too many unrelated tasks into a single list; split them into smaller groups.
- Don't pass raw utility color classes (`bg-gray-100`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block instead.

## Interaction design and acceptance criteria

TaskList composes `Checkbox`; these are integration checks and consumer targets, not executed accessibility tests.

- Use `TaskList` for related completion tasks with a shared milestone, not bulk selection or an immediate binary setting. Compose [Checkbox](Checkbox.md) with `asTask`, supply a `legend`, and keep each task's label clear. Consumers decide whether progress is local, persisted immediately, or submitted later; the wrapper does not save or manage task state.

- Pointer/touch activation of each checkbox label and Tab/Shift+Tab/Space interaction come from `Checkbox`. A checked task gains strikethrough, while the native checked state remains the semantic completion signal. Keep label targets comfortably spaced and verify keyboard focus in the full list.
- Completion is checked on bubbling `change` events from marked task inputs. When all `input[data-task=true]` descendants are checked, the wrapper animates inputs unless reduced motion is preferred. Changing React state/`checked` props alone does not run this event listener; disabled marked tasks still participate in the completion count.
- **Current limits:** there is no progress count, completion callback, aggregate mixed-state checkbox, live completion announcement, or automatic focus movement. The animation selects all inputs inside the wrapper, not only marked tasks; keep unrelated form fields outside it. Consumers provide any needed nonvisual completion/status message without duplicating individual checked-state feedback and verify actual announcements with supported assistive technologies.

## Acceptance criteria

1. **Current behavior:** Given independently labeled tasks, when one checkbox or its label is clicked/tapped, then only that task changes and its checked state and strikethrough agree; controlled task state must be updated by the consumer.
2. **Current behavior:** Given focus on an enabled task, when Space is pressed, then it toggles; Tab/Shift+Tab continues through the enabled tasks and out of the list without a wrapper-specific focus trap.
3. **Current behavior:** Given at least one incomplete marked task and no reduced-motion preference, when a task change makes all marked inputs checked, then the scale/rotation celebration is requested without changing task values.
4. **Current behavior:** Given reduced motion is preferred, when the last task is checked, then completion state changes normally but the celebration is skipped.
5. **Consumer target:** Given task state changes programmatically or completion needs a nonvisual summary, when the list updates, then focus remains usable and the consumer's progress/completion text reflects the actual tasks. Do not rely on prop updates to trigger celebration or on animation to announce completion.

## Accessibility

- Renders a semantic `<fieldset>`; consumers supply a `<legend>` to name the task group.
- Each `Checkbox asTask` keeps its native name, checked state, keyboard handling, and error description.
- Completion animation is visual-only and skipped when reduced motion is preferred. It adds no live completion message or focus-management action.

## Data Attributes

| Attribute | Element

| Value            | Description   |
| ---------------- | ------------- |
| `data-component` | `fieldset` |
| `data-task` | child `input` |

`"task-list"`
Identifies the component.
`"true"`
Must be present on child checkbox inputs for them to be counted in the completion check. Set automatically via `asTask`.

## Notes

- The animation is powered by `motion/react`. When all `input[data-task=true]` elements inside the fieldset are checked, a staggered scale + rotate animation fires starting from the last-checked item's index unless reduced motion is preferred.
- `TaskList` attaches a single `change` event listener on the `<fieldset>` (event delegation) — no per-item wiring is required.
- Any delegated task change that finds all marked task inputs checked can trigger the animation. There is no one-shot completion guard; unchecking and rechecking can replay it.
