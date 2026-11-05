---
title: Tabs
description: Keyboard-accessible tab container for organizing content into switchable panels.
package: "@g4rcez/components"
export: "{ Tabs }"
import: "import { Tabs, Tab } from '@g4rcez/components/tabs'"
category: display
---

# Tabs

Keyboard-accessible tab container with switchable panels.

## Import

```tsx
import { Tabs, Tab } from "@g4rcez/components/tabs";
```

## Props

### Container

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `string` | — | Active ID, synchronized into internal selection state |
| `onChange` | `(id: string) => void` | — | Reports internal selection, including initial and fallback |
| `container` | `string` | — | Extra classes for the outer card container |
| `className` | `string` | — | Extra classes for the card body (content area) |
| `children` | `Tab[]` | — | `Tab` panel components |
| `aria-label` | `string` | — | Accessible name for the tablist |
| `aria-labelledby` | `string` | — | ID reference for the tablist's accessible name |

### Tab (Panel)

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique identifier; matched against `Tabs.active` |
| `title` | `Label` | — | Tab button content; a non-string title also needs `label` in the type |
| `label` | `string` | — | Required by the type for non-string titles; not forwarded as accessible name |
| `disabled` | `boolean` | `false` | Disables the tab button and skips it in keyboard navigation |
| `children` | `React.ReactNode` | — | Panel content, rendered when this tab is active |

## Design Tokens

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-tabs-header-margin-block-end` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-tabs-tab-padding-block` | `calc(var(--var-spacing-base) * 1)` |
| `--var-tabs-tab-padding-inline` | `calc(var(--var-spacing-base) * 2.5)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-card-background` | `--var-card-background` | Composed Card surface |
| `border-card-border` | `--var-card-border` | Composed Card border |
| `bg-border` | `--var-color-border` | Tab bar divider |
| `bg-primary` | `--var-color-primary` | Active indicator |
| `text-primary` | `--var-color-primary` | Active tab text |
| `text-muted-foreground` | `--var-color-muted-foreground` | Disabled tab text |

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

- Set a default `active` tab to avoid an empty initial state.
- Use tab titles of one to three words.
- Order tabs to match the user's workflow.
- Use `disabled` for tabs that are not yet accessible, for example incomplete wizard steps.
- Use design-token classes for custom styling (`bg-background`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-50`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use more than 6–8 tabs. Use sidebar navigation for larger sets.
- Don't use tabs for content that users compare side by side.
- Don't use tabs for primary page-level navigation. Use a nav bar.

## Accessibility

- Tab buttons expose selection with `aria-selected` and disabled state with the native `disabled` attribute.
- Name the tablist with `aria-label` or `aria-labelledby` on `Tabs`.
- `Tab` key enters the tablist at the selected tab (`tabIndex={0}`). Other tabs have `tabIndex={-1}`.
- `ArrowLeft` / `ArrowRight` move between enabled tabs, wrap at the ends, and select the tab immediately.
- `Home` / `End` select the first or last enabled tab.
- Arrow-key and edge navigation skip disabled tabs.
- Keep `active` on an enabled tab. The component does not replace an explicitly selected disabled tab.
- Each tab has `aria-controls` that points to its panel ID.
- The active `tabpanel` has `aria-labelledby` that points to its tab, and `tabIndex={0}`.
- Inactive panels are unmounted. Their local form state is lost.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use `Tabs` for related panels on one page when showing all content at once would hinder the task.
- Keep labels short and stable.
- Use another layout when users must compare panels or see them simultaneously.
- The panel-switching branch of the source Tabbar pattern maps to `Tabs`.
- Destination navigation is a composition, not a `Tabs` feature. Use a named navigation region with native links or `Button as="a"`, and `aria-current="page"`.
- `Tabs` does not supply route changes, link opening in another browser tab, history, route title or focus updates, a persistent bottom bar, or safe-area spacing.
- Click or tap selects a panel.
- Keyboard activation is automatic: Left/Right moves focus and selection together, wraps, and skips disabled tabs. Home/End select the enabled edges.
- No manual-activation or vertical-orientation API exists. Use this pattern only when the selected panel appears without disruptive delay.
- Tab names come from rendered `title` content. `label` is unused at render time, so an icon-only title cannot rely on it.
- Use document-unique IDs, meaningful rendered labels, and hidden decorative icons.
- Selection uses `aria-selected`, not `aria-current`. No live-region announcement exists.

**Consumer responsibilities and design targets**

- Verify visible keyboard focus, readable and touchable labels, horizontal scrolling, and the selected indicator at zoom and narrow widths. The component stylesheet adds no dedicated tab focus ring.
- Keep important panel data outside unmounted content.
- Incoming `active` changes synchronize internal state. User selection also updates internal state, and `onChange` runs on initial selection. Do not treat `Tabs` as a strictly controlled, request-only API.
- Verify name, role, selection, and panel relationships with the application's assistive technologies. Do not assume spoken position or certified accessibility.

## Notes

- Only the active panel's `children` render. Inactive panels are unmounted.
- The tab header list scrolls horizontally on small screens (`overflow-x-auto`).
- `Tabs` is built on `Card`. It inherits card design tokens. `container` and `className` map to the `container` and `className` of the card.
- When `active` matches no `Tab` `id`, the component selects the first non-disabled tab.

## Verification

Acceptance criteria for tests and reviews: [verify/Tabs.md](verify/Tabs.md).
