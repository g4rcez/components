# Component API Documentation

The source-aligned API references for `@g4rcez/components` live in
[`packages/lib/ai/docs`](packages/lib/ai/docs). Start with the [component
index](packages/lib/ai/docs/index.md); it lists the public component
categories, imports, and CSS style dependencies.

This file is kept as a short entry point so it does not duplicate prop tables that can drift from the TypeScript declarations.

## Agent skill

The package ships an agent skill at
[`packages/lib/ai/SKILL.md`](packages/lib/ai/SKILL.md). Installed consumers can
read it at `@g4rcez/components/ai/SKILL.md`.

Install the skill from this repository with:

```bash
npx skills add g4rcez/components --skill csscomponents
```

## Install and CSS setup

```bash
npm install @g4rcez/components
```

Import the foundation before component CSS, or use the bundled stylesheet:

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
```

```tsx
import "@g4rcez/components/index.css";
```

## Quick example

```tsx
import { Button, Input, Masonry } from "@g4rcez/components";

export function Example() {
    return (
        <Masonry>
            <Input title="Search" placeholder="Search records" />
            <Button theme="primary">Search</Button>
        </Masonry>
    );
}
```

Read the individual reference before using a component. The references
document the current props, defaults, accessibility behavior, stable data
attributes, design tokens, and CSS dependencies.

## Public component references

- Core: `Button`, `Heading`, `Polymorph`, `RenderOnView`, `Resizable`,
  `Slot`, `Tag`, `Typography`
- Display: `Alert`, `AnimatedList`, `Calendar`, `Card`, `Empty`, `List`,
  `Masonry`, `Notifications`, `Progress`, `Shortcut`, `Skeleton`, `Spinner`,
  `Stats`, `Step`, `SwipeableList`, `Tabs`, `Timeline`
- Form: `Autocomplete`, `Checkbox`, `DatePicker`, `FileUpload`, `Form`,
  `FormReset`, `Input`, `InputField`, `MultiSelect`, `Radiobox`, `Select`,
  `Slider`, `Switch`, `TaskList`, `Textarea`
- Floating: `CommandPalette`, `Dropdown`, `Expand`, `Menu`, `Modal`,
  `Toolbar`, `Tooltip`, `Wizard`
- Table and calendar: `Table`, `PageCalendar`

`Collapse` is an internal display primitive used by components such as
`Alert`; it is exported from the package root barrel but has no
`@g4rcez/components/collapse` subpath. It is not part of the standalone
component reference map.

## Import examples

Use the root entry point or a documented subpath. Current examples use
`theme` for visual variants and shared size names such as `small`, `default`,
and `big`:

```tsx
import { Button } from "@g4rcez/components/button";
import { Checkbox } from "@g4rcez/components/checkbox";
import { SwipeableList } from "@g4rcez/components/swipeable-list";

<Button theme="primary" size="small">Save</Button>
<Checkbox size="normal">Remember me</Checkbox>
<SwipeableList items={[]} />
```
