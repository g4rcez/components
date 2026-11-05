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

- The `@g4rcez/components/table` subpath exports `Table` and `TableProps`.
- Import the builders, preference hook, `ColType`, `TablePagination` type, and `getModalScrollerRef` from the package root.

## Props

### Table

|Prop|Type|Default|Description|
|---|---|---|---|
|`name`|`string`|—|Persistence key for `useTablePreferences`. Not an accessible table name.|
|`cols`|`Col<T>[]`|—|Column definitions from `createColumns`.|
|`rows`|`T[]`|—|Data array. Each element renders one row.|
|`loading`|`boolean`|`false`|Replaces rows with animated skeleton cells.|
|`loadingMore`|`boolean`|`false`|Shows a pulse footer bar for infinite scroll.|
|`operations`|`boolean`|`true`|Toggles the metadata bar (bulk filter, sort, group controls).|
|`inlineFilter`|`boolean`|`true`|Enables per-column filter dropdowns in the header row.|
|`inlineSorter`|`boolean`|`true`|Enables per-column sort toggles in the header row.|
|`sticky`|`number \| null`|—|Header `top` offset in px. `null` omits it; CSS still sticks the desktop header.|
|`Aside`|`React.FC<CellAsideElement<T>>`|—|Row actions before the first cell value. Rendered only with explicit `loading={false}`.|
|`pagination`|`TablePagination`|—|Pagination config. Shows a footer with page controls.|
|`reference`|`keyof T`|—|Row id field for `selectable`. Not used to key virtual rows.|
|`useControl`|`boolean`|`false`|When `true`, disables internal filtering and sorting.|
|`onScrollEnd`|`() => void`|—|Called when the end sentinel intersects while `loadingMore` is true.|
|`getScrollRef`|`() => HTMLElement \| undefined`|—|Custom scroll container instead of `window`.|
|`getRowProps`|`(row: T) => ComponentProps<"tr">`|—|Per-row `<tr>` props (e.g., `onClick`, `className`).|
|`set`|`(v: TableGetters<T>) => void`|—|Called whenever internal table state changes.|
|`border`|`boolean`|`false`|Column dividers in header and body at ≥768px. Default: horizontal dividers only.|
|`selectable`|`boolean`|`false`|Adds a checkbox column with select-all. Needs `reference`; without it, no column and one dev `console.error`.|
|`selected`|`Array<T[keyof T]>`|—|Controlled selection: `reference` values of selected rows. `undefined` keeps internal selection.|
|`onSelectionChange`|`(ids: Array<T[keyof T]>, rows: T[]) => void`|—|Receives the full new id list and the matching row objects from `rows`.|

### Row selection

- The row id is `row[reference]`.
- The header checkbox acts on rows that pass the active filters (per group when grouped).
- Header checkbox state: none selected is unchecked, some is indeterminate, all is checked.
- A click on unchecked or indeterminate selects all those rows. A click on checked clears them.
- Selected ids hidden by filters stay selected. They do not count in the header state.
- With server pagination, "all" means the rows the table has now. The selection stays across pages while the ids stay in `selected`.
- Checkboxes are disabled while `loading`. The header checkbox is disabled when there are no rows.
- Accessible names come from the `tableSelectAllLabel` and `tableSelectRowLabel(id)` translation keys.

```tsx
const [selected, setSelected] = useState<string[]>([]);
<Table name="clients" cols={cols} rows={clients} reference="id" selectable selected={selected} onSelectionChange={(ids) => setSelected(ids)} />;
```

### createColumns

Use the builder methods below. The `createColumns` callback receives the builder.

|Builder method|Signature|Description|
|---|---|---|
|`add`|`(id: AllPaths<T>, thead: ReactNode \| ((props: TableHeaderCreatorProps) => ReactNode), options?: ColOptions<T, K>) => void`|Registers a column.|
|`remove`|`(id: AllPaths<T>) => void`|Removes a column by id.|
|`filter`|`(c: (col: Col<T>) => boolean) => Col<T>[]`|Filters the column list in-place.|
|`getAll`|`() => Col<T>[]`|Returns a copy of all registered columns.|

### ColOptions

|Option|Type|Default|Description|
|---|---|---|---|
|`type`|`ColType`|`ColType.Text`|Data type (`Text`, `Number`, `Boolean`, `Select`). Sets filter operators.|
|`allowSort`|`boolean`|`true`|Allows sorting this column.|
|`allowFilter`|`boolean`|`true`|Shows a filter control on this column.|
|`visible`|`boolean`|`true`|Sets the initial column visibility.|
|`headerLabel`|`string`|—|Header text for controls. Required for function headers with a label that differs from the column id.|
|`groupTitle`|`Label`|—|Visible heading for grouped tables. Accepts any design-system `Label` value.|
|`Element`|`React.FC<CellPropsElement<T, K>>`|—|Custom cell renderer. Receives `{ row, value, rowIndex, matrix, col }`.|
|`thProps`|`HTMLAttributes<HTMLTableCellElement>`|—|Extra props for the `<th>` element.|
|`cellProps`|`HTMLAttributes<HTMLTableCellElement>`|—|Extra props for each `<td>` element.|

### Column Properties

- Pass a header creator to `add` to receive the bound `Properties` component.
- Render `Properties` in one header cell. Users then show, hide, and reorder columns from a dropdown.

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

- The dropdown keeps its host column visible. Do not set `visible: false` on that column.
- The dropdown position stays fixed while open, including when column changes update the table layout.
- `useTablePreferences` persists column order and visibility.
- Users reorder by dragging rows in the dropdown, or by focusing a reorder handle and pressing the Up and Down arrow keys.

### TablePagination

|Field|Type|Description|
|---|---|---|
|`size`|`number`|Current page size.|
|`pages`|`number`|Total number of pages.|
|`current`|`number`|Current page index (1-based).|
|`hasNext`|`boolean`|Whether a next page exists.|
|`hasPrevious`|`boolean`|Whether a previous page exists.|
|`totalItems`|`number`|Total row count across all pages.|
|`sizes`|`number[]`|Optional list of selectable page sizes.|
|`onChangeSize`|`(size: number) => void`|Called when the user selects a different page size.|
|`asLink`|`React.FC<{ href: number \| "previous" \| "next"; className: string }>`|Polymorphic page button. Supply a router `Link` for deep-linkable pages.|

- Pagination is part of `Table`. There is no standalone public `Pagination` component.
- The footer derives previous/next availability from `current` and `pages`. It does not use `hasPrevious` or `hasNext`.
- `asLink` also receives `children`.
- `asLink` MUST resolve `"previous"`/`"next"` to the intended destination, with real routing or an application click handler.
- Default page buttons have no page-change handler. There is no `onChangePage` option.
- `onChangeSize` handles only page size. The application MUST fetch or supply the matching `rows`.

### useTablePreferences

Persists column order, visibility, active filters, sorters, and groups in `localStorage`, keyed by `name`.

```tsx
const prefs = useTablePreferences("users-table", columns);
// Spread into <Table {...prefs} rows={data} />
```

|Parameter|Type|Description|
|---|---|---|
|`name`|`string`|Storage key (`@components/table-{name}`).|
|`cols`|`Col<T>[]`|Initial column definitions.|
|`options`|`Partial<TableGetters<T>>`|Optional initial state for filters, sorters, groups, pagination.|

## Design Tokens

- Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides remain unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

|Override|Library default|
|---|---|
|`--var-table-groups-gap`|`calc(var(--var-spacing-base) * 1)`|
|`--var-table-group-title-gap`|`calc(var(--var-spacing-base) * 0.25)`|
|`--var-table-group-title-padding-block`|`calc(var(--var-spacing-base) * 0.5)`|
|`--var-table-group-title-padding-inline`|`calc(var(--var-spacing-base) * 0.75)`|
|`--var-table-row-block-size`|`calc(var(--var-spacing-base) * 2.75)`|
|`--var-table-selection-column-inline-size`|`calc(var(--var-spacing-base) * 3)`|
|`--var-table-selection-target-size`|`calc(var(--var-spacing-base) * 2.75)`|
|`--var-table-pill-min-block-size`|`calc(var(--var-spacing-base) * 2.75)`|

Override these CSS variables in your theme to customize the tokens this component reads.

|Token|CSS Variable|Purpose|
|---|---|---|
|`bg-table-header`|`--var-table-header-background`|Column header background|
|—|`--var-table-header-foreground`|Header label, header icons and toolbar labels (7.28:1 light, 7.29:1 dark)|
|—|`--var-table-header-font-size`|Header label and toolbar text size (`--var-typography-sm`)|
|—|`--var-table-row-hover-background`|Row background on hover (hover-capable devices only)|
|`bg-table-background`|`--var-table-background`|Table viewport, footer, and loading cell background|
|`border-table-border`|`--var-table-border`|Row dividers, toolbar pill borders, and column dividers with `border`|
|`text-foreground`|`--var-color-foreground`|Group title text and loading bar color|
|`text-primary`|`--var-color-primary`|Filter/sort action accent|

- `--var-table-cell-padding` sets body-cell and header-content padding.
- Default: `calc(var(--var-spacing-base) * 0.75)` (`0.75rem` at the default spacing base).
- Set it on the table or an ancestor scope.
- Loading and empty-state horizontal padding use `--var-table-cell-padding-inline` instead. Default: `calc(var(--var-spacing-base) * 0.5)`.

## Column Types

|`ColType`|Enum value|Filter operators available|
|---|---|---|
|`ColType.Text`|`"text"`|contains, equals, starts with, ends with|
|`ColType.Number`|`"number"`|=, ≠, >, <, ≥, ≤|
|`ColType.Boolean`|`"boolean"`|is true, is false|
|`ColType.Select`|`"select"`|equals|

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

- Provide a unique `name` per table. Each `name` gets its own isolated `localStorage` slot.
- Use `createColumns` for full TypeScript path inference on deeply nested fields.
- Supply a custom `Element` for cells that need formatting, interactive controls, or icons.
- Use `useTablePreferences` to persist column arrangement across sessions.
- Pass `useControl={true}` and manage data externally when filtering or sorting runs server-side.
- Use design-token classes for wrapper elements (`bg-table-header`, `bg-table-background`, `border-table-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't render `<Table>` without a `name`. Preferences and DOM ids depend on it.
- Don't put heavy rendering logic in the `rows` array transformation. Use `Element` cells so virtualization can skip off-screen rows.
- Don't use `Table` for single-row or trivial datasets. Use a plain list or card layout.

## Interaction design and acceptance criteria

- Use `Table` to compare related values across rows and columns.
- Provide a visible heading that explains the dataset. Provide meaningful column labels. Use `headerLabel` for custom headers.
- `Table` renders native `table`, `thead`, `tbody`, `tr`, `th`, and `td` elements.
- `Table` has no caption and no table-level accessible-name prop. `name` does not label the native table. A named surrounding region can supply context.
- `Table` does not generate complex row or multi-level header associations.
- Keep reading and focus order aligned with the current column and row order.
- Static cells need no extra Tab stops.
- Use existing `Button` controls for custom cell and `Aside` actions. Names MUST identify the row and the action.
- A click handler on `getRowProps` alone adds no keyboard activation.
- `Aside` actions reveal on hover or descendant focus. Check touch discoverability.
- Sort buttons expose column sort state through `aria-sort`. This is not proof of a spoken change announcement.
- The library has a loading status and header `aria-busy`. It has no dedicated result-count, sort-change, or reorder announcement.
- Explain changed results in the application when needed. Do not move focus only to announce them.
- Verify continuity when filtering, removing rows, or scrolling unmounts virtual rows. `reference` gives no stable-key guarantee.
- Below 768 px, CSS hides the header and stacks each row's cells with visible column labels.
- Verify that those labels make each value understandable in the accessibility tree. Desktop header associations do not apply after the header is hidden.
- At 200% text size and a 320 CSS-pixel viewport, retain values and actions without overlap.
- When the application adds horizontal overflow, expose it and make its scroll region keyboard-operable. The table wrapper has no built-in horizontal-scroll Tab stop.

## Pagination

- The footer contains a `nav` and static ellipses, with a visual current-page class.
- The footer does not name the `nav` and does not set `aria-current="page"`. It has no focus-restoration or page-update announcement policy.
- The internal `nav` has no naming prop. A fully named pagination landmark is a library gap. Do not invent an option.
- A consumer `asLink` can name individual controls, mark the current destination, and handle routing.
- Use `Button` for application-handled page actions.
- Preserve focus, or move it deliberately to the newly loaded results.
- Keep boundary controls consistent with `current`/`pages`.

### Reordering

- Column headers support pointer dragging.
- Render the existing `Properties` control for named Up/Down keyboard reorder handles and visibility checkboxes. Its host column stays visible.
- The group-order dropdown also has named Up/Down handles.
- Handles move immediately. There is no Enter-to-pick-up or Escape-to-cancel transaction, no position announcement, and no single-tap move alternative.
- Do not document a generic drag workflow as implemented. Explain the actual keys.
- Verify focus stays with the moved item.
- Do not make precise dragging the only usable path on touch.

## Accessibility

- Native table markup with explicit `table`, `rowgroup`, `row`, and `cell` roles. `<th>` elements give native column-header semantics.
- Each `<th>` exposes sort state through `aria-sort="ascending | descending | none"`.
- Column resizing: `ArrowLeft`/`ArrowRight` on its named button. Hold `Shift` for larger steps. Double-click resets to auto width.
- Keyboard column reordering is available through `Properties`, not the header drag surface.
- `aria-busy` on column headers signals loading state.
- The empty state renders the `Empty` component below the virtual table.
- Virtualization uses `react-virtuoso` with window scrolling by default, or a supplied scroll parent. Verify focus continuity across virtual-row removal in the application.
- Focusable descendants in `Aside` stay in the tab sequence while the overlay is visually concealed.
- Focusing a descendant reveals the overlay. The overlay stays visible until both focus and pointer leave. Hover also reveals it.
- Use the existing `Button` component for custom aside actions so Enter and Space activate them.
- Selection checkboxes are native checkboxes. Tab reaches them. Space toggles them.
- The "select all" checkbox exposes the mixed state.
- Rows get no `aria-selected`, because `role="table"` does not support it. The checkbox state carries the information.
- Each selection checkbox has a hit target of 44×44px or more.
- The per-column filter trigger stays in the tab order. It is transparent at rest unless the column has a filter. It shows on header hover or focus.
- Toolbar triggers read "Sort by: …", "Filter: …" and "Group: …". The visible text is the accessible name.
- With no value, toolbar triggers show `tableNoneLabel` ("None").

## Data Attributes

- `data-tableheader="{colId}"`: on every `<th>`. The column-resizing logic uses it to update `style.width`.
- `data-resized="true"`: set on a `<th>` after the user manually resizes that column.
- `data-type="resizer"`: marks the drag handle element in each header cell.
- `data-border="true" | "false"`: on the table viewport. `true` turns on the column dividers.

## Notes

- Column reordering uses `Reorder.Group` / `Reorder.Item` from `motion/react`. Columns animate to their new positions.
- Internal filtering uses `linq-arrays`.
- Numeric filters operate on `Number.isNaN`-safe values. Empty string filters are skipped.
- `useTablePreferences` merges saved columns against the current definition. New columns added in code always appear, even with a stale snapshot in storage.
- Set `--var-table-cell-padding` per breakpoint on an ancestor scope, for example `className="[--var-table-cell-padding:0.5rem] md:[--var-table-cell-padding:1rem]"` on a wrapper around `<Table>`.
- Pass `getScrollRef={getModalScrollerRef}` when embedding a `Table` inside a `Modal`. This fixes virtualization scroll detection. The package root exports `getModalScrollerRef`.

## Verification

Acceptance criteria for tests and reviews: [verify/Table.md](verify/Table.md).
