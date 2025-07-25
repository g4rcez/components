# Tabs Component

A keyboard-accessible tabs component for organizing content into multiple panels. Features automatic focus management, keyboard navigation, and flexible content organization.

## Import

```tsx
import { Tabs, Tab } from "@g4rcez/components/tabs";
```

## Basic Usage

```tsx
const [activeTab, setActiveTab] = useState("tab1");

<Tabs active={activeTab} onChange={setActiveTab}>
  <Tab id="tab1" title="First Tab">
    <p>Content for the first tab.</p>
  </Tab>
  <Tab id="tab2" title="Second Tab">
    <p>Content for the second tab.</p>
  </Tab>
  <Tab id="tab3" title="Third Tab">
    <p>Content for the third tab.</p>
  </Tab>
</Tabs>;
```

## Components

### Tabs (Container)

| Prop        | Type                   | Default | Description                             |
| ----------- | ---------------------- | ------- | --------------------------------------- |
| `active`    | `string`               | -       | ID of the currently active tab          |
| `onChange`  | `(id: string) => void` | -       | Callback when active tab changes        |
| `container` | `string`               | -       | Additional classes for the container    |
| `className` | `string`               | -       | Additional classes for the content area |
| `children`  | `Tab[]`                | -       | Tab components                          |

### Tab (Panel)

| Prop       | Type              | Default | Description                                |
| ---------- | ----------------- | ------- | ------------------------------------------ |
| `id`       | `string`          | -       | Unique identifier for the tab              |
| `title`    | `string`          | -       | Tab label (when using string title)        |
| `label`    | `string`          | -       | Tab label (when using React element title) |
| `disabled` | `boolean`         | `false` | Whether the tab is disabled                |
| `children` | `React.ReactNode` | -       | Tab panel content                          |

## Examples

### Basic Tabs

```tsx
const BasicTabs = () => {
  const [active, setActive] = useState("overview");

  return (
    <Tabs active={active} onChange={setActive}>
      <Tab id="overview" title="Overview">
        <h3>Project Overview</h3>
        <p>This is the overview of your project.</p>
      </Tab>

      <Tab id="details" title="Details">
        <h3>Project Details</h3>
        <p>Detailed information about your project.</p>
      </Tab>

      <Tab id="settings" title="Settings">
        <h3>Project Settings</h3>
        <p>Configure your project settings here.</p>
      </Tab>
    </Tabs>
  );
};
```

### Tabs with Disabled State

```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
  <Tab id="tab1" title="Available">
    <p>This tab is available.</p>
  </Tab>

  <Tab id="tab2" title="Disabled" disabled>
    <p>This content won't be shown.</p>
  </Tab>

  <Tab id="tab3" title="Also Available">
    <p>This tab is also available.</p>
  </Tab>
</Tabs>
```

### Tabs with Rich Content

```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
  <Tab id="dashboard" title="Dashboard">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 rounded">
        <h4>Statistics</h4>
        <p>Users: 1,234</p>
      </div>
      <div className="p-4 bg-green-50 rounded">
        <h4>Revenue</h4>
        <p>$12,345</p>
      </div>
    </div>
  </Tab>

  <Tab id="analytics" title="Analytics">
    <div className="space-y-4">
      <h3>Analytics Dashboard</h3>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        Chart Placeholder
      </div>
    </div>
  </Tab>

  <Tab id="reports" title="Reports">
    <div>
      <h3>Reports</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">2024-01-01</td>
            <td className="border border-gray-300 p-2">$1,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Tab>
</Tabs>
```

### Controlled Tabs with State Management

```tsx
const ControlledTabs = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Perform actions when tab changes
    if (tabId === "profile") {
      console.log("Loading profile data...");
    }
  };

  return (
    <Tabs active={activeTab} onChange={handleTabChange}>
      <Tab id="profile" title="Profile">
        <div className="space-y-4">
          <div>
            <label>Name:</label>
            <input
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="ml-2 p-1 border rounded"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="ml-2 p-1 border rounded"
            />
          </div>
        </div>
      </Tab>

      <Tab id="preferences" title="Preferences">
        <div className="space-y-4">
          <div>
            <label>
              <input type="checkbox" className="mr-2" />
              Email notifications
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" className="mr-2" />
              Dark mode
            </label>
          </div>
        </div>
      </Tab>

      <Tab id="security" title="Security">
        <div className="space-y-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Change Password
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded">
            Enable 2FA
          </button>
        </div>
      </Tab>
    </Tabs>
  );
};
```

### Dynamic Tabs

```tsx
const DynamicTabs = () => {
  const [tabs, setTabs] = useState([
    { id: "tab1", title: "Tab 1", content: "Content 1" },
    { id: "tab2", title: "Tab 2", content: "Content 2" },
  ]);
  const [activeTab, setActiveTab] = useState("tab1");

  const addTab = () => {
    const newId = `tab${tabs.length + 1}`;
    setTabs([
      ...tabs,
      {
        id: newId,
        title: `Tab ${tabs.length + 1}`,
        content: `Content ${tabs.length + 1}`,
      },
    ]);
    setActiveTab(newId);
  };

  const removeTab = (tabId) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={addTab}
          className="px-3 py-1 bg-green-500 text-white rounded mr-2"
        >
          Add Tab
        </button>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} title={tab.title}>
            <div>
              <p>{tab.content}</p>
              {tabs.length > 1 && (
                <button
                  onClick={() => removeTab(tab.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Remove This Tab
                </button>
              )}
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
```

## Keyboard Navigation

The Tabs component supports full keyboard navigation:

- **Arrow Left**: Move to previous tab
- **Arrow Right**: Move to next tab
- **Tab**: Focus on tab headers
- **Enter/Space**: Activate focused tab

### Navigation Behavior

- Skips disabled tabs automatically
- Wraps around at the beginning/end
- Maintains focus on the active tab
- Supports screen reader announcements

## Styling

The Tabs component includes:

- **Card Container**: Built on the Card component
- **Tab Headers**: Horizontal scrollable tab list
- **Active Indicator**: Bottom border for active tab
- **Hover States**: Visual feedback for interactive elements
- **Disabled States**: Reduced opacity for disabled tabs

## Use Cases

### 1. **Settings Panels**

```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
  <Tab id="general" title="General">
    <GeneralSettings />
  </Tab>
  <Tab id="privacy" title="Privacy">
    <PrivacySettings />
  </Tab>
  <Tab id="notifications" title="Notifications">
    <NotificationSettings />
  </Tab>
</Tabs>
```

### 2. **Product Information**

```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
  <Tab id="description" title="Description">
    <ProductDescription />
  </Tab>
  <Tab id="specifications" title="Specifications">
    <ProductSpecs />
  </Tab>
  <Tab id="reviews" title="Reviews">
    <ProductReviews />
  </Tab>
</Tabs>
```

### 3. **Dashboard Sections**

```tsx
<Tabs active={activeTab} onChange={setActiveTab}>
  <Tab id="overview" title="Overview">
    <DashboardOverview />
  </Tab>
  <Tab id="analytics" title="Analytics">
    <AnalyticsDashboard />
  </Tab>
  <Tab id="reports" title="Reports">
    <ReportsSection />
  </Tab>
</Tabs>
```

### 4. **Form Wizards**

```tsx
<Tabs active={currentStep} onChange={setCurrentStep}>
  <Tab id="step1" title="Personal Info">
    <PersonalInfoForm />
  </Tab>
  <Tab id="step2" title="Address" disabled={!step1Complete}>
    <AddressForm />
  </Tab>
  <Tab id="step3" title="Payment" disabled={!step2Complete}>
    <PaymentForm />
  </Tab>
</Tabs>
```

## Accessibility

- **ARIA Roles**: Proper tab/tabpanel roles
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Automatic focus handling
- **Screen Readers**: Proper announcements
- **Disabled States**: Proper ARIA attributes

## Best Practices

1. **Meaningful Labels**: Use clear, descriptive tab titles
2. **Logical Order**: Arrange tabs in a logical sequence
3. **State Management**: Handle active state properly
4. **Loading States**: Show loading indicators for async content
5. **Responsive Design**: Consider mobile layouts
6. **Content Organization**: Group related content logically

## Tailwind CSS v4 Integration

The Tabs component leverages Tailwind CSS v4's advanced features for enhanced responsive behavior and styling.

### Using CSS Variables for Dynamic Theming

```tsx
// Tabs with custom theme using CSS variables
<Tabs
  active={activeTab}
  onChange={setActiveTab}
  className="bg-[--tabs-bg] border-[--tabs-border]"
  style={{
    "--tabs-bg": "color-mix(in srgb, theme(colors.slate.50) 95%, white)",
    "--tabs-border": "theme(colors.slate.200)",
    "--tab-active-color": "theme(colors.purple.600)",
    "--tab-active-border": "theme(colors.purple.600)",
  }}
>
  <Tab id="tab1" title="Custom Tab 1">
    <p>Content with custom theming.</p>
  </Tab>
  <Tab id="tab2" title="Custom Tab 2">
    <p>More themed content.</p>
  </Tab>
</Tabs>
```

### Container Queries for Responsive Tabs

```tsx
// Tabs that adapt layout based on container size
<div className="@container max-w-4xl mx-auto">
  <Tabs
    active={activeTab}
    onChange={setActiveTab}
    className="@container"
    container="@sm:p-4 @lg:p-6"
  >
    <Tab id="overview" title="Overview">
      <div className="@sm:space-y-3 @lg:space-y-6">
        <h3 className="@sm:text-lg @lg:text-2xl font-bold">Project Overview</h3>
        <div className="grid @sm:grid-cols-1 @lg:grid-cols-2 gap-4">
          <div className="@sm:p-3 @lg:p-4 bg-gray-50 rounded">
            <h4 className="@sm:text-sm @lg:text-base font-medium">
              Statistics
            </h4>
            <p className="@sm:text-xs @lg:text-sm text-gray-600">Key metrics</p>
          </div>
          <div className="@sm:p-3 @lg:p-4 bg-gray-50 rounded">
            <h4 className="@sm:text-sm @lg:text-base font-medium">Progress</h4>
            <p className="@sm:text-xs @lg:text-sm text-gray-600">
              Current status
            </p>
          </div>
        </div>
      </div>
    </Tab>

    <Tab id="details" title="Details">
      <div className="@sm:text-sm @lg:text-base @sm:space-y-2 @lg:space-y-4">
        <p>Detailed information that adapts to container size.</p>
      </div>
    </Tab>
  </Tabs>
</div>
```

### Advanced Tab Styling with CSS Grid

```tsx
// Tabs with complex layout using CSS Grid areas
<Tabs
  active={activeTab}
  onChange={setActiveTab}
  className="[grid-template-areas:'header''content'] grid-rows-[auto_1fr] min-h-[400px]"
>
  <Tab id="dashboard" title="Dashboard">
    <div className="grid [grid-template-areas:'sidebar_main''sidebar_main'] @lg:[grid-template-areas:'sidebar_main'] grid-cols-1 @lg:grid-cols-[250px_1fr] gap-6 h-full">
      <aside className="[grid-area:sidebar] @lg:border-r @lg:pr-6">
        <nav className="space-y-2">
          <a
            href="#"
            className="block p-2 rounded hover:bg-gray-100 transition-colors"
          >
            Analytics
          </a>
          <a
            href="#"
            className="block p-2 rounded hover:bg-gray-100 transition-colors"
          >
            Reports
          </a>
        </nav>
      </aside>

      <main className="[grid-area:main] space-y-4">
        <h3 className="text-xl font-bold">Dashboard Content</h3>
        <div className="grid @sm:grid-cols-1 @lg:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4>Metric 1</h4>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4>Metric 2</h4>
            <p className="text-2xl font-bold">5,678</p>
          </div>
        </div>
      </main>
    </div>
  </Tab>

  <Tab id="settings" title="Settings">
    <div className="max-w-2xl space-y-6">
      <h3 className="text-xl font-bold">Settings</h3>
      <div className="space-y-4">
        <div className="flex @sm:flex-col @lg:flex-row @sm:gap-2 @lg:gap-4 @lg:items-center">
          <label className="@sm:text-sm @lg:text-base font-medium @lg:w-48">
            Theme Preference
          </label>
          <select className="@sm:w-full @lg:w-auto px-3 py-2 border rounded">
            <option>Light</option>
            <option>Dark</option>
            <option>Auto</option>
          </select>
        </div>
      </div>
    </div>
  </Tab>
</Tabs>
```

### Animated Tab Transitions

```tsx
// Tabs with smooth content transitions
<Tabs active={activeTab} onChange={setActiveTab} className="@container">
  <Tab id="tab1" title="Animated Tab 1">
    <div className="animate-[fadeInUp_0.4s_ease-out] space-y-4">
      <h3 className="text-xl font-bold">Content 1</h3>
      <p>This content fades in with animation.</p>
      <div className="grid @sm:grid-cols-1 @lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item, index) => (
          <div
            key={item}
            className="p-4 bg-gray-50 rounded animate-[slideInLeft_0.5s_ease-out]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            Item {item}
          </div>
        ))}
      </div>
    </div>
  </Tab>

  <Tab id="tab2" title="Animated Tab 2">
    <div className="animate-[fadeInUp_0.4s_ease-out] space-y-4">
      <h3 className="text-xl font-bold">Content 2</h3>
      <p>Different content with the same smooth animation.</p>
    </div>
  </Tab>
</Tabs>
```

```css
/* Custom animations for tab content */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Vertical Tabs Layout

```tsx
// Vertical tabs using CSS Grid
<div className="@container">
  <div className="grid @sm:grid-cols-1 @lg:grid-cols-[200px_1fr] gap-6 min-h-[400px]">
    {/* Custom tab navigation */}
    <nav className="@lg:border-r @lg:pr-4">
      <div className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <div className="font-medium">{tab.title}</div>
            <div className="text-sm text-gray-500">{tab.description}</div>
          </button>
        ))}
      </div>
    </nav>

    {/* Tab content */}
    <div className="@container">
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        className="border-none shadow-none"
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} title={tab.title}>
            <div className="animate-[fadeIn_0.3s_ease-out]">{tab.content}</div>
          </Tab>
        ))}
      </Tabs>
    </div>
  </div>
</div>
```

## Notes

- Only one tab panel is rendered at a time (performance optimization)
- Tab headers are horizontally scrollable on smaller screens
- The component automatically selects the first available tab if none is specified
- Disabled tabs are skipped during keyboard navigation
- The active tab state is controlled externally for maximum flexibility
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and CSS Grid areas
- Enhanced with smooth animations and responsive layout capabilities
- Supports complex layouts with sidebar navigation and multi-column content
