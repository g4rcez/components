---
title: Table
description: Virtualized, sortable, filterable data table with column reordering, grouping, and pagination.
package: "@g4rcez/components"
export: "{ Table, createColumns, useTablePreferences, ColType }"
import: "import { Table, createColumns, useTablePreferences, ColType } from '@g4rcez/components'"
category: table
---

# Table

Virtualized, sortable, filterable data table with column reordering, grouping, and pagination.

## Import

```tsx
import { Table, createColumns, useTablePreferences, ColType } from "@g4rcez/components";
```

The `@g4rcez/components/table` subpath exports `Table` and `TableProps`. Import the builders, preference hook, `ColType`, `TablePagination` type, and `getModalScrollerRef` from the package root.

## Props

<<<<<<< Updated upstream
### Table

| Prop           | Type                               | Default | Description                                                                      |
| -------------- | ---------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `name`         | `string`                           | —       | Unique identifier used to persist user preferences in `localStorage`.            |
| `cols`         | `Col<T>[]`                         | —       | Column definitions produced by `createColumns`.                                  |
| `rows`         | `T[]`                              | —       | Data array to render. Each element maps to a table row.                          |
| `loading`      | `boolean`                          | `false` | Replaces rows with animated skeleton cells while data loads.                     |
| `loadingMore`  | `boolean`                          | `false` | Shows a pulse footer bar for infinite-scroll loading indicators.                 |
| `operations`   | `boolean`                          | `true`  | Toggles the metadata bar (bulk filter, sort, group controls).                    |
| `inlineFilter` | `boolean`                          | `true`  | Enables per-column filter dropdowns in the header row.                           |
| `inlineSorter` | `boolean`                          | `true`  | Enables per-column sort toggles in the header row.                               |
| `sticky`       | `number \| null`                   | —       | `top` offset in px for the sticky header. Pass `null` to disable stickiness.     |
| `Aside`        | `React.FC<CellAsideElement<T>>`    | —       | Component rendered before the first cell in every row (e.g., row-level actions). |
| `pagination`   | `TablePagination`                  | —       | Pagination configuration. When provided, a footer with page controls is shown.   |
| `reference`    | `keyof T`                          | —       | Field used as the stable row key.                                                |
| `useControl`   | `boolean`                          | `false` | When `true`, disables internal filtering/sorting so you can drive it externally. |
| `onScrollEnd`  | `() => void`                       | —       | Called when the user scrolls to the last row (infinite scroll trigger).          |
| `getScrollRef` | `() => HTMLElement \| undefined`   | —       | Returns a custom scroll container instead of `window`.                           |
| `getRowProps`  | `(row: T) => ComponentProps<"tr">` | —       | Merge arbitrary `<tr>` props (e.g., `onClick`, `className`) per row.             |
| `set`          | `(v: TableGetters<T>) => void`     | —       | External callback invoked whenever internal table state changes.                 |
| `border`       | `boolean`                          | `false` | Shows column dividers in header and body (≥768px). The default look has horizontal dividers only. |
| `selectable`   | `boolean`                          | `false` | Adds a first column with a checkbox per row and a "select all" checkbox. Needs `reference`; without it, no column renders and one `console.error` is logged in development. |
| `selected`     | `Array<T[keyof T]>`                | —       | Controlled selection: the `reference` values of the selected rows. Leave `undefined` to let the table keep its own selection. |
| `onSelectionChange` | `(ids: Array<T[keyof T]>, rows: T[]) => void` | — | Called with the full new id list and the matching row objects from `rows`. |

### Row selection

- The row id is `row[reference]`.
- The header checkbox works on the rows that pass the active filters (per group when grouped): none selected → unchecked, some → indeterminate, all → checked. A click on unchecked or indeterminate selects all of them; a click on checked clears them.
- Selected ids that the filters hide stay selected and do not count in the header state.
- With server pagination, "all" means the rows the table has now. The selection stays across pages while the ids stay in `selected`.
- Checkboxes are disabled while `loading`. The header checkbox is disabled when there are no rows.
- Accessible names come from the `tableSelectAllLabel` and `tableSelectRowLabel(id)` translation keys.

```tsx
const [selected, setSelected] = useState<string[]>([]);
<Table name="clients" cols={cols} rows={clients} reference="id" selectable selected={selected} onSelectionChange={(ids) => setSelected(ids)} />;
```
||||||| Stash base
### Table

| Prop           | Type                               | Default | Description                                                                      |
| -------------- | ---------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `name`         | `string`                           | —       | Unique identifier used to persist user preferences in `localStorage`.            |
| `cols`         | `Col<T>[]`                         | —       | Column definitions produced by `createColumns`.                                  |
| `rows`         | `T[]`                              | —       | Data array to render. Each element maps to a table row.                          |
| `loading`      | `boolean`                          | `false` | Replaces rows with animated skeleton cells while data loads.                     |
| `loadingMore`  | `boolean`                          | `false` | Shows a pulse footer bar for infinite-scroll loading indicators.                 |
| `operations`   | `boolean`                          | `true`  | Toggles the metadata bar (bulk filter, sort, group controls).                    |
| `inlineFilter` | `boolean`                          | `true`  | Enables per-column filter dropdowns in the header row.                           |
| `inlineSorter` | `boolean`                          | `true`  | Enables per-column sort toggles in the header row.                               |
| `sticky`       | `number \| null`                   | —       | `top` offset in px for the sticky header. Pass `null` to disable stickiness.     |
| `Aside`        | `React.FC<CellAsideElement<T>>`    | —       | Component rendered before the first cell in every row (e.g., row-level actions). |
| `pagination`   | `TablePagination`                  | —       | Pagination configuration. When provided, a footer with page controls is shown.   |
| `reference`    | `keyof T`                          | —       | Field used as the stable row key.                                                |
| `useControl`   | `boolean`                          | `false` | When `true`, disables internal filtering/sorting so you can drive it externally. |
| `onScrollEnd`  | `() => void`                       | —       | Called when the user scrolls to the last row (infinite scroll trigger).          |
| `getScrollRef` | `() => HTMLElement \| undefined`   | —       | Returns a custom scroll container instead of `window`.                           |
| `getRowProps`  | `(row: T) => ComponentProps<"tr">` | —       | Merge arbitrary `<tr>` props (e.g., `onClick`, `className`) per row.             |
| `set`          | `(v: TableGetters<T>) => void`     | —       | External callback invoked whenever internal table state changes.                 |
=======
| Prop           | Type                               | Default | Description                                                                                                    |
| -------------- | ---------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `name`         | `string`                           | —       | Identifier used by `useTablePreferences` for persistence; not an accessible table name.                        |
| `cols`         | `Col<T>[]`                         | —       | Column definitions produced by `createColumns`.                                                                |
| `rows`         | `T[]`                              | —       | Data array to render. Each element maps to a table row.                                                        |
| `loading`      | `boolean`                          | `false` | Replaces rows with animated skeleton cells while data loads.                                                   |
| `loadingMore`  | `boolean`                          | `false` | Shows a pulse footer bar for infinite-scroll loading indicators.                                               |
| `operations`   | `boolean`                          | `true`  | Toggles the metadata bar (bulk filter, sort, group controls).                                                  |
| `inlineFilter` | `boolean`                          | `true`  | Enables per-column filter dropdowns in the header row.                                                         |
| `inlineSorter` | `boolean`                          | `true`  | Enables per-column sort toggles in the header row.                                                             |
| `sticky`       | `number \| null`                   | —       | Configured header offset in px. `null` omits the configured offset; CSS still makes the desktop header sticky. |
| `Aside`        | `React.FC<CellAsideElement<T>>`    | —       | Row actions before the first cell's value; currently rendered only with explicit `loading={false}`.            |
| `pagination`   | `TablePagination`                  | —       | Pagination configuration. When provided, a footer with page controls is shown.                                 |
| `reference`    | `keyof T`                          | —       | Accepted by the public type but currently not used to key virtual rows.                                        |
| `useControl`   | `boolean`                          | `false` | When `true`, disables internal filtering/sorting so you can drive it externally.                               |
| `onScrollEnd`  | `() => void`                       | —       | Called when the end sentinel intersects while `loadingMore` is true.                                           |
| `getScrollRef` | `() => HTMLElement \| undefined`   | —       | Returns a custom scroll container instead of `window`.                                                         |
| `getRowProps`  | `(row: T) => ComponentProps<"tr">` | —       | Merge arbitrary `<tr>` props (e.g., `onClick`, `className`) per row.                                           |
| `set`          | `(v: TableGetters<T>) => void`     | —       | External callback invoked whenever internal table state changes.                                               |
>>>>>>> Stashed changes

### createColumns

The `createColumns` builder provides these methods:

- `c.add(id, header, options)` registers a column.
- `c.remove(id)` removes a column by id.
- `c.filter(predicate)` filters the column list.
- `c.getAll()` returns a copy of all registered columns.

| Builder method | Signature                                                                                                                    | Description                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `add`          | `(id: AllPaths<T>, thead: ReactNode \| ((props: TableHeaderCreatorProps) => ReactNode), options?: ColOptions<T, K>) => void` | Registers a column.                       |
| `remove`       | `(id: AllPaths<T>) => void`                                                                                                  | Removes a column by id.                   |
| `filter`       | `(c: (col: Col<T>) => boolean) => Col<T>[]`                                                                                  | Filters the column list in-place.         |
| `getAll`       | `() => Col<T>[]`                                                                                                               | Returns a copy of all registered columns. |

### ColOptions

| Option        | Type                                   | Default        | Description                                                                                                              |
| ------------- | -------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `type`        | `ColType`                              | `ColType.Text` | Data type (`Text`, `Number`, `Boolean`, `Select`). Affects filter operators.                                             |
| `allowSort`   | `boolean`                              | `true`         | Whether this column can be sorted.                                                                                       |
| `allowFilter` | `boolean`                              | `true`         | Whether this column shows a filter control.                                                                              |
| `visible`     | `boolean`                              | `true`         | Sets the initial column visibility.                                                                                      |
| `headerLabel` | `string`                               | —              | Overrides the column header text used in controls. Required for function headers whose label differs from the column id. |
| `groupTitle`  | `Label`                                | —              | Visible heading for grouped tables created from this column. Accepts any design-system `Label` value.                    |
| `Element`     | `React.FC<CellPropsElement<T, K>>`     | —              | Custom cell renderer. Receives `{ row, value, rowIndex, matrix, col }`.                                                  |
| `thProps`     | `HTMLAttributes<HTMLTableCellElement>` | —              | Extra props forwarded to the `<th>` element.                                                                             |
| `cellProps`   | `HTMLAttributes<HTMLTableCellElement>` | —              | Extra props forwarded to each `<td>` element.                                                                            |

### Column Properties

Pass a header creator to `add` to receive the bound `Properties` component. Render it in one header cell to let users show, hide, and reorder columns from a dropdown.

```tsx
const columns = createColumns<User>((column) => {
    column.add(
        "name",
        ({ Properties }) => (
            <>
                {" "}
                <Properties /> Name{" "}
            </>
        ),
        { headerLabel: "Name" }
    );
    column.add("email", "Email");
    column.add("role", "Role");
});
```

The dropdown keeps its host column visible so users cannot lose access to the control. Its position stays fixed while it is open, including when column changes update the table layout. Do not set `visible: false` on that column. Column order and visibility are included in `useTablePreferences` persistence. Users can drag rows in the dropdown or focus a reorder handle and use the Up and Down arrow keys.

### TablePagination

| Field          | Type                                                                    | Description                                                               |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `size`         | `number`                                                                | Current page size.                                                        |
| `pages`        | `number`                                                                | Total number of pages.                                                    |
| `current`      | `number`                                                                | Current page index (1-based).                                             |
| `hasNext`      | `boolean`                                                               | Whether a next page exists.                                               |
| `hasPrevious`  | `boolean`                                                               | Whether a previous page exists.                                           |
| `totalItems`   | `number`                                                                | Total row count across all pages.                                         |
| `sizes`        | `number[]`                                                              | Optional list of selectable page sizes.                                   |
| `onChangeSize` | `(size: number) => void`                                                | Called when the user selects a different page size.                       |
| `asLink` | `React.FC<{ href: number \| "previous" \| "next"; className: string }>` | Polymorphic page button — supply a router `Link` for deep-linkable pages. |

Pagination is part of `Table`, not a standalone public `Pagination` component. The footer derives previous/next availability from `current` and `pages`; it does not use `hasPrevious` or `hasNext` to gate controls. `asLink` also receives `children`. It must resolve `"previous"`/`"next"` to the intended destination and provide real routing or an application click handler. Default page buttons have no page-change handler, and there is no `onChangePage` option. `onChangeSize` handles only page size; the application must fetch/supply the corresponding `rows`.

### useTablePreferences

Persists column order, visibility, active filters, sorters, and groups in `localStorage` keyed by `name`.

```tsx
const prefs = useTablePreferences("users-table", columns);
// Spread into <Table {...prefs} rows={data} />
```

| Parameter | Type                       | Description                                                                |
| --------- | -------------------------- | -------------------------------------------------------------------------- |
| `name`    | `string`                   | Storage key (`@components/table-{name}`).                                  |
| `cols`    | `Col<T>[]`                 | Initial column definitions.                                                |
| `options` | `Partial<TableGetters<T>>` | Optional initial state overrides for filters, sorters, groups, pagination. |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                 | Library default                        |
| ---------------------------------------- | -------------------------------------- |
| `--var-table-groups-gap`                 | `calc(var(--var-spacing-base) * 1)`    |
| `--var-table-group-title-gap`            | `calc(var(--var-spacing-base) * 0.25)` |
| `--var-table-group-title-padding-block`  | `calc(var(--var-spacing-base) * 0.5)`  |
| `--var-table-group-title-padding-inline` | `calc(var(--var-spacing-base) * 0.75)` |
| `--var-table-row-block-size` | `calc(var(--var-spacing-base) * 3)` |
| `--var-table-selection-column-inline-size` | `calc(var(--var-spacing-base) * 3)` |
| `--var-table-selection-target-size` | `calc(var(--var-spacing-base) * 2.75)` |
| `--var-table-pill-min-block-size` | `calc(var(--var-spacing-base) * 2.75)` |

<<<<<<< Updated upstream
Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token                 | CSS Variable         | Purpose                                 |
| --------------------- | -------------------- | --------------------------------------- |
| `bg-table-header` | `--var-table-header-background` | Column header background |
| — | `--var-table-header-foreground` | Header label, header icons and toolbar labels (7.28:1 light, 7.29:1 dark) |
| — | `--var-table-header-font-size` | Header label and toolbar text size (`--var-typography-sm`) |
| — | `--var-table-row-hover-background` | Row background on hover (hover-capable devices only) |
| `bg-table-background` | `--var-table-background` | Table viewport, footer, and loading cell background |
| `border-table-border` | `--var-table-border` | Row dividers, toolbar pill borders, and column dividers with `border` |
| `text-foreground` | `--var-color-foreground` | Group title text and loading bar color |
||||||| Stash base
Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token                 | CSS Variable         | Purpose                                 |
| --------------------- | -------------------- | --------------------------------------- |
| `bg-table-header` | `--var-table-header-background` | Column header background |
| `bg-table-background` | `--var-table-background` | Table viewport, footer, and loading cell background |
| `border-table-border` | `--var-table-border` | Column separators and row dividers |
| `text-foreground` | `--var-color-foreground` | Group title text and loading bar color |
=======
| Token | CSS Variable          | Purpose                         |
| --------------------- | ------------------------------- | --------------------------------------------------- |
| `bg-table-header`     | `--var-table-header-background` | Column header background                            |
| `bg-table-background` | `--var-table-background`        | Table viewport, footer, and loading cell background |
| `border-table-border` | `--var-table-border`            | Column separators and row dividers                  |
| `text-foreground`     | `--var-color-foreground`        | Group title text and loading bar color              |
>>>>>>> Stashed changes
| `text-primary` | `--var-color-primary` | Filter/sort action accent |

The `--var-table-cell-padding` property controls body-cell and header-content padding. Its default is `calc(var(--var-spacing-base) * 0.75)` (`0.75rem` at the default spacing base). Set it on the table or an ancestor scope. Loading and empty-state horizontal padding instead use `--var-table-cell-padding-inline`, defaulting to `calc(var(--var-spacing-base) * 0.5)`.

## Column Types

| `ColType`         | Enum value  | Filter operators available               |
| ----------------- | ----------- | ---------------------------------------- |
| `ColType.Text`    | `"text"`    | contains, equals, starts with, ends with |
| `ColType.Number`  | `"number"`  | =, ≠, >, <, ≥, ≤                         |
| `ColType.Boolean` | `"boolean"` | is true, is false                        |
| `ColType.Select`  | `"select"`  | equals                                   |

## Examples

### Basic table

```tsx
import { Table, createColumns } from "@g4rcez/components";
type User = { id: string; name: string; email: string; role: string };
const columns = createColumns<User>((c) => {
    c.add("id", "ID");
    c.add("name", "Name");
    c.add("email", "Email");
    c.add("role", "Role", { groupTitle: <span>Users by role</span> });
});
export function UsersTable({ users }: { users: User[] }) {
    return <Table name="users" cols={columns} rows={users} />;
}
```

### Custom cell renderer

```tsx
import { Table, createColumns, ColType } from "@g4rcez/components";
import { Tag } from "@g4rcez/components/tag";
type Product = { sku: string; name: string; price: number; active: boolean };
const columns = createColumns<Product>((c) => {
    c.add("sku", "SKU");
    c.add("name", "Product Name", { allowFilter: true, allowSort: true });
    c.add("price", "Price", {
        type: ColType.Number,
        Element: ({ value }) => (
            <span className="font-mono tabular-nums">{value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
        ),
    });
    c.add("active", "Status", {
        type: ColType.Boolean,
        Element: ({ value }) => (
            <Tag theme={value ? "success" : "neutral"} size="small">
                {" "}
                {value ? "Active" : "Inactive"}{" "}
            </Tag>
        ),
    });
});
```

### Persisted preferences

```tsx
import { Table, createColumns, useTablePreferences } from "@g4rcez/components";
const baseColumns = createColumns<Order>((c) => {
    c.add("id", "Order ID");
    c.add("status", "Status");
    c.add("total", "Total");
});
export function OrdersTable({ orders }: { orders: Order[] }) {
    const prefs = useTablePreferences("orders-table", baseColumns);
    return <Table {...prefs} rows={orders} />;
}
```

### Server-side pagination

```tsx
<Table
    name="invoices"
    cols={columns}
    rows={pageData}
    useControl
    pagination={{
        current: page,
        pages: totalPages,
        size: pageSize,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        sizes: [10, 25, 50],
        onChangeSize: setPageSize,
        asLink: ({ href, className, children }) => (
            <a href={`?page=${href}`} className={className}>
                {" "}
                {children}{" "}
            </a>
        ),
    }}
/>
```

### Row-level actions with Aside

```tsx
import { TrashIcon, PencilIcon } from "@phosphor-icons/react";
import { Button } from "@g4rcez/components/button";
<Table
    name="contacts"
    cols={columns}
    rows={contacts}
    loading={false}
    Aside={({ row }) => (
        <div className="flex gap-1">
            {" "}
            <Button theme="ghost-neutral" size="icon" onClick={() => edit(row)} aria-label="Edit">
                <PencilIcon size={14} aria-hidden="true" />
            </Button>{" "}
            <Button theme="ghost-danger" size="icon" onClick={() => remove(row)} aria-label="Delete">
                <TrashIcon size={14} aria-hidden="true" />
            </Button>{" "}
        </div>
    )}
/>;
```

### Infinite scroll

```tsx
<Table name="feed" cols={columns} rows={items} loadingMore={isFetchingNextPage} onScrollEnd={fetchNextPage} />
```

## Do

- Provide a unique `name` to ensure each table has its own isolated `localStorage` slot.
- Use `createColumns` for full TypeScript path inference on deeply nested fields.
- Supply a custom `Element` for cells that need formatting, interactive controls, or icons.
- Use `useTablePreferences` when users should be able to persist their column arrangement across sessions.
- Pass `useControl={true}` and manage data externally when filtering/sorting must happen server-side.
- Use design-token classes for wrapper elements (`bg-table-header`, `bg-table-background`, `border-table-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't render `<Table>` without a `name` — preferences and DOM ids rely on it.
- Don't put heavy rendering logic directly inside `rows` array transformation; use `Element` cells instead so virtualization can skip off-screen rows.
- Don't use `Table` for single-row or trivial datasets — a plain list or card layout is more appropriate.

## Interaction design and acceptance criteria

- Use `Table` when comparing related values across rows and columns. Provide a visible heading explaining the dataset and meaningful column labels; use `headerLabel` for custom headers. It renders native `table`, `thead`, `tbody`, `tr`, `th`, and `td` elements, but supplies no caption or table-level accessible-name prop. A named surrounding region can supply context; `name` does not label the native table. Complex row/multi-level header associations are not generated.

- Keep reading and focus order aligned with the current column/row order. Static cells need no extra Tab stops. Use existing `Button` controls for custom cell/`Aside` actions, with names that identify the row as well as the action. A click handler on `getRowProps` alone does not add keyboard activation. Aside actions reveal on hover or descendant focus, but touch discoverability still needs checking.
- Sort buttons expose column sort state through `aria-sort`; this is not proof of a spoken change announcement. The library has a loading status and header `aria-busy`, but no dedicated result-count, sort-change, or reorder announcement. Explain changed results in the application when necessary, without moving focus merely to announce them. Verify continuity when filtering, removing rows, or scrolling causes virtual rows to unmount; `reference` currently provides no stable-key guarantee.
- At widths below 768 px, CSS hides the header and stacks each row's cells with visible column labels. Verify that those labels still make each value understandable in the accessibility tree; desktop header associations cannot be assumed after the header is hidden. At 200% text size and a 320 CSS-pixel viewport, retain values and actions without overlap. If an application introduces horizontal overflow, expose that fact and make its scroll region keyboard-operable; the current table wrapper has no built-in horizontal-scroll Tab stop. #

## Pagination

and reordering boundaries The footer contains a `nav` and static ellipses, with a visual current-page class. It does not name the navigation or set `aria-current="page"` and has no focus-restoration or page-update announcement policy. A consumer `asLink` can name individual controls, mark the current destination, and handle routing; use `Button` for application-handled page actions. The internal nav has no naming prop. A fully named pagination landmark remains a library gap, not an option to invent. Preserve focus or move it deliberately to the newly loaded results, and keep boundary controls consistent with `current`/`pages`. Column headers support pointer dragging. Render the existing `Properties` control to offer named Up/Down keyboard reorder handles and visibility checkboxes; its host column stays visible. The group-order dropdown also has named Up/Down handles. These handles move immediately: there is no Enter-to-pick-up/Escape-to-cancel transaction, position announcement, or single-tap move alternative. Do not document 's generic drag workflow as implemented. Explain the actual keys, verify focus stays with the moved item, and avoid requiring precise dragging as the only usable path on touch.

## Acceptance criteria

These are integration targets to verify, not accessibility certification or observed screen-reader results. Some expose the current limitations above. 1. **Given** a dataset with descriptive headers, **when** rows are read in desktop and stacked layouts, **then** each value retains its column context and the dataset's purpose is visible. 2. **Given** sortable columns and row actions, **when** a user navigates with Tab/Shift+Tab and activates controls with Enter/Space, **then** focus is visible, `aria-sort` reflects the chosen order, and the intended row action runs without requiring hover. 3. **Given** an open Properties or group-order dropdown, **when** a named reorder handle receives Up/Down, **then** the item moves one position, cannot move beyond an end, and focus remains on that item. Verify instructions and change feedback separately; they are not generated. 4. **Given** consumer-routed pagination, **when** a page control is activated, **then** the matching rows and current-page indication update, ellipses stay non-interactive, and focus remains predictable. A named landmark and `aria-current="page"` are design targets, not current footer guarantees. 5. **Given** long values, zoom, or a narrow viewport, **when** users read, scroll, filter, or remove a focused row, **then** values and actions remain reachable and any disappearing focus target has a deliberate replacement.

## Accessibility

- Renders native table markup with explicit `table`, `rowgroup`, `row`, and `cell` roles; `<th>` elements provide native column-header semantics.
- Sort state is exposed via `aria-sort="ascending | descending | none"` on each `<th>`.
- Column resizing supports `ArrowLeft`/`ArrowRight` on its named button (hold `Shift` for larger steps; double-click resets to auto width). Keyboard column reordering is available through `Properties`, not the header drag surface itself.
- `aria-busy` on column headers signals loading state to assistive technologies.
- Empty state renders the `Empty` component below the virtual table instead of leaving users with no visible explanation.
- Virtualization uses `react-virtuoso` with window scrolling by default or a supplied scroll parent. Focus continuity across virtual-row removal needs integration verification.
- Focusable descendants in `Aside` participate in the tab sequence while the overlay is visually concealed. Focusing one reveals the overlay; it stays visible until both focus and pointer leave. Hover continues to reveal the overlay.
<<<<<<< Updated upstream
- Use native buttons for aside actions so Enter and Space activate them.
- Selection checkboxes are native checkboxes: Tab reaches them and Space toggles them. The "select all" checkbox exposes the mixed state. Rows do not get `aria-selected`, because `role="table"` does not support it; the checkbox state carries the information.
- Each selection checkbox has a hit target of 44×44px or more.
- The per-column filter trigger stays in the tab order. It is transparent at rest unless the column has a filter, and shows on header hover or focus.
- Toolbar triggers read "Sort by: …", "Filter: …" and "Group: …". The visible text is the accessible name. With no value, they show `tableNoneLabel` ("None").
||||||| Stash base
- Use native buttons for aside actions so Enter and Space activate them.
=======
- Use the existing `Button` component for custom aside actions so Enter and Space activate them.
>>>>>>> Stashed changes

## Data Attributes

- `data-tableheader="{colId}"` — present on every `<th>`, used by the column-resizing logic to update `style.width`.
- `data-resized="true"` — set on a `<th>` after the user manually resizes that column.
- `data-type="resizer"` — identifies the drag handle element within each header cell.
- `data-border="true" | "false"` — on the table viewport; `true` turns on the column dividers.

## Notes

- Column reordering uses `motion/react`'s `Reorder.Group` / `Reorder.Item`, so columns animate smoothly to their new positions.
- Internal filtering uses `linq-arrays`. Numeric filters operate on `Number.isNaN`-safe values; empty string filters are skipped.
- `useTablePreferences` merges saved columns back against the current definition so new columns added in code always appear, even if a user has a stale snapshot in storage.
- Set `--var-table-cell-padding` per breakpoint on an ancestor scope, for example `className="[--var-table-cell-padding:0.5rem] md:[--var-table-cell-padding:1rem]"` on a wrapper around `<Table>`.
- Pass `getScrollRef={getModalScrollerRef}` (`getModalScrollerRef` is exported from the package root) when embedding a `Table` inside a `Modal` to fix virtualization scroll detection.
