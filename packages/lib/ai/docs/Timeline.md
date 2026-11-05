---
title: Timeline
description: Vertical chronological event list with icon markers, body content, and optional right-side metadata.
package: "@g4rcez/components"
export: "{ Timeline }"
import: "import { Timeline, TimelineItem } from '@g4rcez/components/timeline'"
category: display
---

# Timeline

Vertical chronological event list with icon markers, body content, and optional right-side metadata.

## Import

```tsx
import { Timeline, TimelineItem } from "@g4rcez/components/timeline";
```

## Components

### Timeline

Root container. Renders a `<ul>` with `role="list"`. The connector line on the last item is hidden automatically.

### TimelineItem

Single event entry. Renders an `<li>` with `role="listitem"`. It uses `pb-12` vertical spacing for the connector line.

### TimelineItem.Icon

Visual marker: a rounded circle that holds an icon. Renders a `<header>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | — | Overrides icon container appearance. |
| `children` | `React.ReactNode` | — | Icon element. |

### TimelineItem.Body

Main content area. Polymorphic. Renders a `<section>` by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | `"section"` | HTML element to render. |
| `className` | `string` | — | Additional classes. |
| `children` | `React.ReactNode` | — | Event body content. |

### TimelineItem.Right

Optional right-side slot for timestamps or auxiliary actions. Renders inside a `<footer>` wrapper. Polymorphic. Renders a `<button>` by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | `"button"` | HTML element to render. |
| `children` | `React.ReactNode` | — | Right-side content. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks of `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set; the table shows examples.

| Override | Library default |
| --- | --- |
| `--var-timeline-item-padding-block-end` | `calc(var(--var-spacing-base) * 2)` |
| `--var-timeline-connector-inset-block-start` | `calc(var(--var-spacing-base) * 2)` |
| `--var-timeline-connector-inset-inline-start` | `calc(var(--var-spacing-base) * 1)` |
| `--var-timeline-content-gap` | `calc(var(--var-spacing-base) * 0.75)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `bg-border` | `--var-color-border` | Connector color |
| `bg-primary` | `--var-color-primary` | Default icon background |
| `text-primary-foreground` | `--var-color-primary-foreground` | Default icon color |

## Examples

### Order Tracking Timeline

```tsx
import { CheckIcon, PackageIcon, TruckIcon } from "@phosphor-icons/react";
<Timeline>
    {" "}
    <TimelineItem>
        {" "}
        <TimelineItem.Icon>
            {" "}
            <CheckIcon size={20} />{" "}
        </TimelineItem.Icon>{" "}
        <TimelineItem.Body>
            {" "}
            <h4 className="font-bold">Order Placed</h4>{" "}
            <p className="text-muted-foreground">Your order has been received and is being processed.</p>{" "}
        </TimelineItem.Body>{" "}
        <TimelineItem.Right as="time">10:00 AM</TimelineItem.Right>{" "}
    </TimelineItem>{" "}
    <TimelineItem>
        {" "}
        <TimelineItem.Icon>
            {" "}
            <PackageIcon size={20} />{" "}
        </TimelineItem.Icon>{" "}
        <TimelineItem.Body>
            {" "}
            <h4 className="font-bold">Packed</h4> <p className="text-muted-foreground">Your order has been packed and is ready for shipment.</p>{" "}
        </TimelineItem.Body>{" "}
        <TimelineItem.Right as="time">1:00 PM</TimelineItem.Right>{" "}
    </TimelineItem>{" "}
    <TimelineItem>
        {" "}
        <TimelineItem.Icon>
            {" "}
            <TruckIcon size={20} />{" "}
        </TimelineItem.Icon>{" "}
        <TimelineItem.Body>
            {" "}
            <h4 className="font-bold">Shipped</h4> <p className="text-muted-foreground">Your package is on its way.</p>{" "}
        </TimelineItem.Body>{" "}
        <TimelineItem.Right as="time">2:30 PM</TimelineItem.Right>{" "}
    </TimelineItem>
</Timeline>;
```

### Simple Text Timeline

```tsx
<Timeline>
    {" "}
    <TimelineItem>
        {" "}
        <TimelineItem.Body>
            {" "}
            <strong>Step 1:</strong> Initial setup completed.{" "}
        </TimelineItem.Body>{" "}
    </TimelineItem>{" "}
    <TimelineItem>
        {" "}
        <TimelineItem.Body>
            {" "}
            <strong>Step 2:</strong> Data migration started.{" "}
        </TimelineItem.Body>{" "}
    </TimelineItem>
</Timeline>
```

### Activity Feed

```tsx
import { UserIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
function ActivityFeed({ events }: { events: ActivityEvent[] }) {
    const iconMap = { create: UserIcon, update: PencilSimpleIcon, delete: TrashIcon };
    return (
        <Timeline>
            {" "}
            {events.map((event) => {
                const Icon = iconMap[event.type];
                return (
                    <TimelineItem key={event.id}>
                        {" "}
                        <TimelineItem.Icon>
                            {" "}
                            <Icon size={18} />{" "}
                        </TimelineItem.Icon>{" "}
                        <TimelineItem.Body>
                            {" "}
                            <p className="font-medium">
                                {" "}
                                {event.user} {event.action}{" "}
                            </p>{" "}
                            <p className="text-sm text-muted-foreground">{event.description}</p>{" "}
                        </TimelineItem.Body>{" "}
                        <TimelineItem.Right as="time" dateTime={event.iso}>
                            {" "}
                            {event.relativeTime}{" "}
                        </TimelineItem.Right>{" "}
                    </TimelineItem>
                );
            })}{" "}
        </Timeline>
    );
}
```

### Custom Icon Background

```tsx
import { WarningCircleIcon } from "@phosphor-icons/react";
<TimelineItem>
    {" "}
    <TimelineItem.Icon className="bg-danger text-danger-foreground">
        {" "}
        <WarningCircleIcon size={20} />{" "}
    </TimelineItem.Icon>{" "}
    <TimelineItem.Body>
        {" "}
        <h4 className="font-bold text-danger-foreground">Deployment Failed</h4>{" "}
        <p className="text-muted-foreground">Build step exited with code 1.</p>{" "}
    </TimelineItem.Body>
</TimelineItem>;
```

## Do

- Use icons that show the status or type of the event.
- Keep body content short. Link to a detail view for long content.
- Keep one chronological order (ascending or descending) in the whole list.
- Mark timestamps with `as="time"` and a `dateTime` attribute.
- Use design-token classes for icon background overrides (`bg-success`, `bg-danger`).

## Don't

- Don't pass raw utility color classes (`bg-green-500`, `text-red-600`) for icon backgrounds. Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't put much information in one `TimelineItem`. Link to detail pages.
- Don't use `Timeline` for non-sequential data. Use `List` or `Table` for unordered collections.

## Accessibility

- `Timeline` is a `<ul role="list">`. Each `TimelineItem` is an `<li role="listitem">`.
- The connector `<span>` between items has `aria-hidden="true"`. It is decorative.
- A CSS selector hides the last connector (`[&>li:last-child>span[aria-hidden=true]]:hidden`). No JS is needed.

## Data Attributes

- `data-component="timeline"`: on the `<ul>` container.
- `data-component="timeline-item"`: on each `<li>` entry.

## Notes

- `TimelineItem.Right` defaults to `as="button"`. Set `as="time"` or `as="span"` when the slot is non-interactive.
- `pb-12` on `TimelineItem` sets the vertical spacing between entries. The connector line fills this gap.
- `TimelineItem` works without `TimelineItem.Icon`. The connector line still renders from the left edge.
