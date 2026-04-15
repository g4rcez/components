---
title: TransferList
description: Two-panel component for moving items between a source list and a target list.
package: "@g4rcez/components"
export: "{ TransferList }"
import: "import { TransferList } from '@g4rcez/components/transfer-list'"
category: form
---

# TransferList

Two-panel component for moving items between a source list and a target list.

## Import

```tsx
import { TransferList } from "@g4rcez/components/transfer-list";
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `T[]` | — | Items in the left (available) list. |
| `target` | `T[]` | — | Items in the right (selected) list. |
| `Item` | `React.FC<{ data: T }>` | — | Component used to render each list row. |
| `reference` | `keyof T` | — | Unique key used to identify and compare items (e.g., `"id"`). |
| `setSource` | `Dispatch<SetStateAction<T[]>>` | — | State setter for the source list. |
| `setTarget` | `Dispatch<SetStateAction<T[]>>` | — | State setter for the target list. |

## Design Tokens

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable | Purpose |
|-------|-------------|---------|
| `border-card-border` | `--card-border` | Border around each list panel |
| `bg-background` | `--background` | Panel background (inherited) |
| `text-foreground` | `--foreground` | Item text color (inherited) |
| `border-border` | `--border` | Section divider inside the panel header |

## Examples

### Basic transfer list

```tsx
import { useState } from "react";
import { TransferList } from "@g4rcez/components/transfer-list";

type Role = { id: string; name: string };

const allRoles: Role[] = [
  { id: "admin", name: "Administrator" },
  { id: "editor", name: "Editor" },
  { id: "viewer", name: "Viewer" },
  { id: "auditor", name: "Auditor" },
];

const RoleItem: React.FC<{ data: Role }> = ({ data }) => (
  <span className="text-sm text-foreground">{data.name}</span>
);

export default function RoleAssignment() {
  const [available, setAvailable] = useState(allRoles);
  const [assigned, setAssigned] = useState<Role[]>([]);

  return (
    <TransferList
      source={available}
      target={assigned}
      setSource={setAvailable}
      setTarget={setAssigned}
      reference="id"
      Item={RoleItem}
    />
  );
}
```

### With custom item rendering

```tsx
import { ShieldIcon } from "@phosphor-icons/react";
import { TransferList } from "@g4rcez/components/transfer-list";

type Permission = { id: string; label: string; scope: string };

const PermissionItem: React.FC<{ data: Permission }> = ({ data }) => (
  <span className="flex items-center gap-base">
    <ShieldIcon size={14} className="text-primary" />
    <span className="text-sm text-foreground">{data.label}</span>
    <span className="ml-auto text-xs text-muted-foreground">{data.scope}</span>
  </span>
);

export default function PermissionManager() {
  const [source, setSource] = useState(allPermissions);
  const [target, setTarget] = useState<Permission[]>([]);

  return (
    <TransferList
      source={source}
      target={target}
      setSource={setSource}
      setTarget={setTarget}
      reference="id"
      Item={PermissionItem}
    />
  );
}
```

## Do

- Provide a unique, stable `reference` key for each item (typically the primary key from your data model).
- Use `TransferList` when users need to pick a significant number of items from a large pool.
- Keep the `Item` component focused on displaying — handle mutations via `setSource` / `setTarget`.
- Use design-token classes inside `Item` for text and icon colors (`text-foreground`, `text-primary`, `text-muted-foreground`).

## Don't

- Don't use `TransferList` for very small lists (3–5 items) where `MultiSelect` or a `Checkbox` group would be faster.
- Don't perform expensive side effects inside the `Item` component — keep it purely presentational.
- Don't pass raw Tailwind color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary Tailwind values (`bg-[#abc]`) — override CSS variables in your `@theme` block instead.

## Accessibility

- Each item is rendered with a `Checkbox` for selection, giving it full keyboard and screen-reader support.
- Lists are virtualized using `react-virtuoso` for performance with large datasets.
- Transfer buttons use `CaretRightIcon` from `@phosphor-icons/react` and should have descriptive `aria-label` attributes when used.

## Data Attributes

The `TransferList` component does not set component-specific `data-*` attributes directly. Individual list items inherit `data-component` and accessibility attributes from the embedded `Checkbox` components.

## Notes

- Uses `react-virtuoso` with a `useWindowScroll` strategy — the list height adapts to the parent container via `useParentHeight`.
- The source panel includes a built-in `Input` search field for quick filtering.
- The component is a generic `<T extends POJO>` — TypeScript will infer `T` from `source` and `target` props.
- Only the source-to-target transfer button (`ChevronRightIcon`) is currently wired in the implementation; bidirectional transfer requires wiring additional buttons if needed.
