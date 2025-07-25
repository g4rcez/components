# Tag Component

A versatile label/badge component for displaying metadata, status, or categorization information. Built with polymorphic capabilities and multiple visual variants.

## Import

```tsx
import { Tag } from "@g4rcez/components/tag";
```

## Basic Usage

```tsx
<Tag>Default Tag</Tag>
```

## Props

| Prop        | Type                                                                                                                                   | Default     | Description                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------- |
| `theme`     | `"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral" \| "custom" \| "disabled" \| "loading"` | `"primary"` | Visual theme/variant of the tag    |
| `size`      | `"icon" \| "small" \| "default" \| "big"`                                                                                              | `"default"` | Size of the tag                    |
| `icon`      | `React.ReactNode`                                                                                                                      | -           | Icon to display in the tag         |
| `indicator` | `"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral"`                                        | -           | Shows a colored dot indicator      |
| `loading`   | `boolean`                                                                                                                              | `false`     | Shows loading state with animation |
| `as`        | `React.ElementType`                                                                                                                    | `"span"`    | HTML element to render as          |
| `className` | `string`                                                                                                                               | -           | Additional CSS classes             |
| `children`  | `React.ReactNode`                                                                                                                      | -           | Tag content                        |

## Theme Variants

- **primary**: Primary brand color
- **secondary**: Secondary color scheme
- **info**: Information/neutral styling
- **warn**: Warning/caution styling
- **danger**: Error/destructive styling
- **success**: Success/positive styling
- **muted**: Subtle/subdued styling
- **neutral**: Transparent with border
- **custom**: No default styling (for custom themes)
- **disabled**: Disabled appearance with opacity
- **loading**: Loading state with pulse animation

## Size Variants

- **icon**: Minimal padding for icon-only tags (`p-1`)
- **small**: Small tag (`h-6 p-2 px-3 text-sm`)
- **default**: Standard tag (`h-8 px-4 py-2`)
- **big**: Large tag (`h-12 px-6 py-4`)

## Examples

### Basic Variants

```tsx
<Tag theme="primary">Primary</Tag>
<Tag theme="secondary">Secondary</Tag>
<Tag theme="info">Info</Tag>
<Tag theme="warn">Warning</Tag>
<Tag theme="danger">Error</Tag>
<Tag theme="success">Success</Tag>
<Tag theme="muted">Muted</Tag>
<Tag theme="neutral">Neutral</Tag>
```

### Sizes

```tsx
<Tag size="small">Small</Tag>
<Tag size="default">Default</Tag>
<Tag size="big">Big</Tag>
```

### With Icons

```tsx
import { StarIcon, AlertTriangleIcon, CheckIcon } from "lucide-react";

<Tag icon={<StarIcon size={14} />} theme="warn">
  Featured
</Tag>

<Tag icon={<CheckIcon size={14} />} theme="success">
  Completed
</Tag>

<Tag size="icon" theme="danger">
  <AlertTriangleIcon size={14} />
</Tag>
```

### With Indicators

```tsx
<Tag indicator="success">Online</Tag>
<Tag indicator="danger">Offline</Tag>
<Tag indicator="warn">Pending</Tag>
<Tag indicator="info">Processing</Tag>
```

### Status Tags

```tsx
const StatusTag = ({ status }) => {
  const config = {
    active: { theme: "success", indicator: "success" },
    pending: { theme: "warn", indicator: "warn" },
    inactive: { theme: "muted", indicator: "muted" },
    error: { theme: "danger", indicator: "danger" }
  };

  const { theme, indicator } = config[status] || config.inactive;

  return (
    <Tag theme={theme} indicator={indicator}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Tag>
  );
};

<StatusTag status="active" />
<StatusTag status="pending" />
<StatusTag status="error" />
```

### Loading State

```tsx
<Tag loading theme="primary">
  Processing...
</Tag>
```

### Polymorphic Usage

```tsx
// Render as button
<Tag as="button" onClick={() => console.log('clicked')} theme="primary">
  Clickable Tag
</Tag>

// Render as link
<Tag as="a" href="/category/react" theme="info">
  React
</Tag>
```

### Category Tags

```tsx
const categories = [
  { name: "React", theme: "info" },
  { name: "TypeScript", theme: "primary" },
  { name: "CSS", theme: "success" },
  { name: "JavaScript", theme: "warn" },
];

<div className="flex gap-2 flex-wrap">
  {categories.map((category) => (
    <Tag key={category.name} theme={category.theme}>
      {category.name}
    </Tag>
  ))}
</div>;
```

### Priority Tags

```tsx
<Tag theme="danger" size="small">High Priority</Tag>
<Tag theme="warn" size="small">Medium Priority</Tag>
<Tag theme="muted" size="small">Low Priority</Tag>
```

### User Role Tags

```tsx
const UserRoleTag = ({ role }) => {
  const roleConfig = {
    admin: { theme: "danger", icon: "👑" },
    moderator: { theme: "warn", icon: "🛡️" },
    user: { theme: "info", icon: "👤" },
    guest: { theme: "muted", icon: "👻" },
  };

  const config = roleConfig[role] || roleConfig.guest;

  return (
    <Tag theme={config.theme} size="small">
      {config.icon} {role}
    </Tag>
  );
};
```

## Use Cases

### 1. **Content Categorization**

```tsx
<article>
  <h2>Article Title</h2>
  <div className="flex gap-2 mb-4">
    <Tag theme="primary">React</Tag>
    <Tag theme="info">Tutorial</Tag>
    <Tag theme="success">Beginner</Tag>
  </div>
  <p>Article content...</p>
</article>
```

### 2. **Status Indicators**

```tsx
<div className="user-list">
  {users.map((user) => (
    <div key={user.id} className="flex items-center gap-2">
      <span>{user.name}</span>
      <Tag
        theme={user.isOnline ? "success" : "muted"}
        indicator={user.isOnline ? "success" : "muted"}
        size="small"
      >
        {user.isOnline ? "Online" : "Offline"}
      </Tag>
    </div>
  ))}
</div>
```

### 3. **Filter Tags**

```tsx
const FilterTags = ({ activeFilters, onRemoveFilter }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {activeFilters.map((filter) => (
        <Tag
          key={filter.id}
          as="button"
          theme="neutral"
          onClick={() => onRemoveFilter(filter.id)}
          className="hover:bg-gray-100"
        >
          {filter.label} ×
        </Tag>
      ))}
    </div>
  );
};
```

### 4. **Notification Badges**

```tsx
<div className="relative">
  <BellIcon size={24} />
  <Tag
    size="small"
    theme="danger"
    className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs"
  >
    3
  </Tag>
</div>
```

## Accessibility

- Uses semantic HTML elements
- Supports keyboard navigation when used as interactive elements
- Proper color contrast for all theme variants
- Screen reader friendly with meaningful content
- Supports ARIA attributes when used as buttons or links

## Styling

The Tag component uses Tailwind CSS classes and supports:

- Rounded pill shape by default
- Smooth transitions and hover effects
- Consistent spacing and typography
- Theme-based color schemes
- Custom className override

## Data Attributes

- `data-component="tag"`: Identifies the component
- `data-theme`: Current theme variant

## Best Practices

1. **Consistent Theming**: Use consistent color themes for similar types of information
2. **Size Appropriateness**: Choose sizes that fit the context and hierarchy
3. **Meaningful Content**: Use clear, concise labels
4. **Interactive States**: Provide hover/focus states for clickable tags
5. **Accessibility**: Ensure sufficient color contrast and meaningful text

## Notes

- The component forwards refs properly for external access
- Supports all standard HTML element attributes based on the `as` prop
- Indicators are purely visual and don't affect the tag's semantic meaning
- Loading state automatically applies pulse animation
- The component is polymorphic and can render as any HTML element
