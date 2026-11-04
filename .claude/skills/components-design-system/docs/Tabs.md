---
title: Tabs
description: Keyboard-accessible tab container for organizing content into switchable panels.
package: "@g4rcez/components"
export: "{ Tabs }"
import: "import { Tabs, Tab } from '@g4rcez/components/tabs'"
category: display
---

# Tabs

Keyboard-accessible tab container for organizing content into switchable panels.

## Import

```tsx
import { Tabs, Tab } from "@g4rcez/components/tabs";
```

## Props

### Container



| Prop              | Type                   | Default | Description                                                      |
| ----------------- | ---------------------- | ------- | ---------------------------------------------------------------- |
| `active`          | `string`               | —       | Active ID synchronized into internal selection state             |
| `onChange`        | `(id: string) => void` | —       | Reports internal selection, including initial/fallback selection |
| `container`       | `string`               | —       | Additional classes for the outer card container                  |
| `className`       | `string`               | —       | Additional classes for the card body (content area)              |
| `children`        | `Tab[]`                | —       | `Tab` panel components                                           |
| `aria-label`      | `string`               | —       | Accessible name for the tablist.                                 |
| `aria-labelledby` | `string`               | —       | ID reference for the tablist's accessible name.                  |

### Tab (Panel)

| Prop       | Type              | Default | Description                                                                                   |
| ---------- | ----------------- | ------- | --------------------------------------------------------------------------------------------- |
| `id`       | `string`          | —       | Unique identifier; matched against `Tabs.active`                                              |
| `title`    | `Label`           | —       | Rendered tab button content; non-string titles also require `label` in the type               |
| `label`    | `string`          | —       | Required by the type for non-string titles, but currently not forwarded as an accessible name |
| `disabled` | `boolean`         | `false` | Disables the tab button and skips it during keyboard navigation                               |
| `children` | `React.ReactNode` | —       | Panel content rendered when this tab is active                                                |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                             | Library default                       |
| ------------------------------------ | ------------------------------------- |
| `--var-tabs-header-margin-block-end` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-tabs-tab-padding-block`       | `calc(var(--var-spacing-base) * 1)`   |
| `--var-tabs-tab-padding-inline`      | `calc(var(--var-spacing-base) * 2.5)` |

| Token | CSS Variable            | Purpose                        |
| ----------------------- | ------------------------------ | --------------------- |
| `bg-card-background`    | `--var-card-background`        | Composed Card surface |
| `border-card-border`    | `--var-card-border`            | Composed Card border  |
| `bg-border`             | `--var-color-border`           | Tab bar divider       |
| `bg-primary`            | `--var-color-primary`          | Active indicator      |
| `text-primary`          | `--var-color-primary`          | Active tab text       |
| `text-muted-foreground` | `--var-color-muted-foreground` | Disabled tab text     |

## Examples

### Basic Tabs

```tsx
const [active, setActive] = useState("overview");
<Tabs active={active} onChange={setActive} aria-label="Project sections">
    {" "}
    <Tab id="overview" title="Overview">
        {" "}
        <h3>Project Overview</h3> <p>This is the overview of your project.</p>{" "}
    </Tab>{" "}
    <Tab id="details" title="Details">
        {" "}
        <h3>Project Details</h3> <p>Detailed information about your project.</p>{" "}
    </Tab>{" "}
    <Tab id="settings" title="Settings">
        {" "}
        <h3>Project Settings</h3> <p>Configure your project settings here.</p>{" "}
    </Tab>
</Tabs>;
```

### With Disabled State



```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
    {" "}
    <Tab id="available" title="Available">
        {" "}
        <p>This tab is available.</p>{" "}
    </Tab>{" "}
    <Tab id="locked" title="Locked" disabled>
        {" "}
        <p>This content is not accessible yet.</p>{" "}
    </Tab>{" "}
    <Tab id="also-available" title="Also Available">
        {" "}
        <p>This tab is also available.</p>{" "}
    </Tab>
</Tabs>
```

### Settings Panel

```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
    {" "}
    <Tab id="general" title="General">
        {" "}
        <GeneralSettings />{" "}
    </Tab>{" "}
    <Tab id="privacy" title="Privacy">
        {" "}
        <PrivacySettings />{" "}
    </Tab>{" "}
    <Tab id="notifications" title="Notifications">
        {" "}
        <NotificationSettings />{" "}
    </Tab>
</Tabs>
```

### Dynamic Tabs

```tsx
import { Button } from "@g4rcez/components/button";

function DynamicTabs() {
    const [tabs, setTabs] = useState([
        { id: "tab1", title: "Tab 1", content: "Content 1" },
        { id: "tab2", title: "Tab 2", content: "Content 2" },
    ]);
    const [activeTab, setActiveTab] = useState("tab1");
    const addTab = () => {
        const newId = `tab${tabs.length + 1}`;
        setTabs([...tabs, { id: newId, title: `Tab ${tabs.length + 1}`, content: `Content ${tabs.length + 1}` }]);
        setActiveTab(newId);
    };
    return (
        <div className="space-y-4">
            {" "}
            <Button onClick={addTab} theme="primary">
                Add Tab
            </Button>{" "}
            <Tabs active={activeTab} onChange={setActiveTab}>
                {" "}
                {tabs.map((tab) => (
                    <Tab key={tab.id} id={tab.id} title={tab.title}>
                        {" "}
                        <p>{tab.content}</p>{" "}
                    </Tab>
                ))}{" "}
            </Tabs>{" "}
        </div>
    );
}
```

### Form Wizard with Disabled Steps

```tsx
<Tabs active={currentStep} onChange={setCurrentStep}>
    {" "}
    <Tab id="step1" title="Personal Info">
        {" "}
        <PersonalInfoForm />{" "}
    </Tab>{" "}
    <Tab id="step2" title="Address" disabled={!step1Complete}>
        {" "}
        <AddressForm />{" "}
    </Tab>{" "}
    <Tab id="step3" title="Payment" disabled={!step2Complete}>
        {" "}
        <PaymentForm />{" "}
    </Tab>
</Tabs>
```

## Do

- Always set a default `active` tab to prevent an empty initial state.
- Use clear, concise tab titles (one to three words).
- Arrange tabs in a logical order matching the user's workflow.
- Use `disabled` for tabs not yet accessible (e.g. incomplete wizard steps).
- Use design-token classes for any custom styling (`bg-background`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-50`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block.
- Don't use more than 6–8 tabs; prefer sidebar navigation for larger sets.
- Don't use tabs for content that needs to be compared side-by-side.
- Don't use tabs for primary page-level navigation; use a nav bar instead.

## Accessibility

- Tab buttons expose selection with `aria-selected` and disabled state through the native `disabled` attribute.
- Name the tablist with `aria-label` or `aria-labelledby` on `Tabs`.
- `Tab` enters the tablist at the selected tab (`tabIndex={0}`); other tabs have `tabIndex={-1}`. `ArrowLeft` / `ArrowRight` wraps between enabled tabs and selects them immediately. `Home` / `End` selects the first / last enabled tab.
- Disabled tabs are skipped during arrow-key and edge navigation. Keep `active` on an enabled tab; an explicitly selected disabled tab is not automatically replaced.
- Each tab has `aria-controls` pointing to its panel ID; the active `tabpanel` has `aria-labelledby` pointing back to its tab and `tabIndex={0}`. Inactive panels are unmounted, so their local form state is lost.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use `Tabs` for related panels in the same page when showing all content at once would hinder the task. Keep labels short and stable; use another layout when users must compare panels or retain simultaneous access.

- The panel-switching branch of 's Tabbar maps to `Tabs`. Destination navigation is only a composition, not a `Tabs` feature: use a named navigation region with native links or `Button as="a"` and `aria-current="page"`. `Tabs` does not supply route changes, link opening in another browser tab, history, route title/focus updates, a persistent bottom bar, or safe-area spacing.
- Clicking or tapping selects a panel. Keyboard activation is automatic: Left/Right moves focus and selection together, wraps, and skips disabled tabs; Home/End selects the enabled edges. There is no manual-activation or vertical-orientation API. Choose this pattern only when the selected panel can appear without disruptive delay.
- Name the tablist through `aria-label` or `aria-labelledby`. Tab names come from rendered `title` content: `label` is currently unused at render time, so an icon-only title cannot rely on it. Use document-unique IDs, meaningful rendered labels, and hidden decorative icons. Selection is exposed with `aria-selected`, not `aria-current`; there is no live-region announcement. **Consumer responsibilities and design targets** Verify visible keyboard focus, readable/touchable labels, horizontal scrolling, and the selected indicator at zoom and narrow widths; the component stylesheet does not add a dedicated tab focus ring. Preserve important panel data outside unmounted content. Incoming `active` changes synchronize internal state, but user selection also updates internally, and `onChange` runs on initial selection; do not treat it as a strictly controlled request-only API. Verify name, role, selection, and panel relationships with the application's assistive technologies rather than assuming spoken position or certified accessibility. **Acceptance criteria — verify in the consuming application** 1. **Given** an enabled tab, **when** it is clicked or tapped, **then** its `aria-selected` becomes `true`, its panel is available, and the previous panel's content is unmounted.

2. **Given** focus on the selected tab, **when** Left/Right or Home/End is pressed, **then** focus and selection move together to the appropriate enabled tab, wrapping at the ends for Left/Right.
3. **Given** the tablist between other controls, **when** Tab enters and leaves it, **then** entry reaches the selected tab and the next Tab reaches the active focusable panel; focus remains visible without visiting every inactive tab.
4. **Given** a named tablist with unique tab IDs, **when** its accessibility properties are inspected, **then** each rendered tab has a meaningful name, selection state, and associated active panel; a non-string title is not named by `label` alone.
5. **Given** a bar that changes page destinations, **when** a link is activated with Enter or opened in another browser tab, **then** native link behavior, `aria-current`, title, history, and logical route focus work as consumer-owned navigation; using `Tabs` alone does not satisfy this criterion.

## Notes

- Only the active panel's `children` are rendered — inactive panels are unmounted.
- The tab header list is horizontally scrollable on small screens (`overflow-x-auto`).
- `Tabs` is built on top of `Card`, so it inherits card design tokens and the `container` / `className` props map to the card's `container` and `className` respectively.
- If `active` does not match any `Tab` `id`, the component selects the first available non-disabled tab automatically.
