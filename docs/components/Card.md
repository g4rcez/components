# Card Component

A flexible container component for grouping related content. Provides consistent styling, optional headers, and a composable API for building complex layouts.

## Import

```tsx
import { Card } from "@g4rcez/components/card";
```

## Basic Usage

```tsx
<Card>
  <p>Card content goes here.</p>
</Card>
```

## Props

| Prop             | Type                         | Default | Description                               |
| ---------------- | ---------------------------- | ------- | ----------------------------------------- |
| `title`          | `React.ReactNode`            | -       | Card title (creates automatic header)     |
| `titleClassName` | `string`                     | `""`    | Additional classes for the title header   |
| `header`         | `React.ReactElement \| null` | `null`  | Custom header element (overrides title)   |
| `container`      | `string`                     | `""`    | Additional classes for the card container |
| `as`             | `React.ElementType`          | `"div"` | HTML element to render as                 |
| `className`      | `string`                     | `""`    | Additional classes for the card body      |
| `children`       | `React.ReactNode`            | -       | Card content                              |

## Subcomponents

### Card.Title

A specialized header component for cards with title and navigation elements.

| Prop       | Type                           | Default | Description                    |
| ---------- | ------------------------------ | ------- | ------------------------------ |
| `title`    | `React.ReactElement \| string` | -       | The title content              |
| `titleTag` | `React.ElementType`            | `"h2"`  | HTML element for the title     |
| `navTag`   | `React.ElementType`            | `"nav"` | HTML element for navigation    |
| `as`       | `React.ElementType`            | `"div"` | HTML element for the container |
| `children` | `React.ReactNode`              | -       | Navigation/action elements     |

## Examples

### Basic Card

```tsx
<Card>
  <h3>Welcome</h3>
  <p>This is a simple card with basic content.</p>
</Card>
```

### Card with Title

```tsx
<Card title="User Profile">
  <div className="space-y-4">
    <div>
      <label>Name:</label>
      <p>John Doe</p>
    </div>
    <div>
      <label>Email:</label>
      <p>john@example.com</p>
    </div>
  </div>
</Card>
```

### Card with Custom Title Styling

```tsx
<Card
  title="Dashboard Statistics"
  titleClassName="text-2xl text-blue-600 border-blue-200"
>
  <div className="grid grid-cols-2 gap-4">
    <div>Users: 1,234</div>
    <div>Revenue: $12,345</div>
  </div>
</Card>
```

### Card with Custom Header

```tsx
<Card
  header={
    <header className="flex justify-between items-center p-4 border-b">
      <h2>Custom Header</h2>
      <button>Settings</button>
    </header>
  }
>
  <p>Content with a completely custom header.</p>
</Card>
```

### Card.Title with Navigation

```tsx
<Card>
  <Card.Title title="Project Overview">
    <button className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
    <button className="px-3 py-1 border border-gray-300 rounded">Share</button>
  </Card.Title>

  <div className="space-y-4">
    <p>Project description and details...</p>
    <div>Status: Active</div>
  </div>
</Card>
```

### Nested Cards

```tsx
<Card title="Main Dashboard">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card title="Statistics">
      <div>Chart content here</div>
    </Card>

    <Card title="Recent Activity">
      <ul>
        <li>User logged in</li>
        <li>New order received</li>
        <li>Payment processed</li>
      </ul>
    </Card>
  </div>
</Card>
```

### Card as Different Elements

```tsx
// As article
<Card as="article" title="Blog Post">
  <p>Blog post content...</p>
</Card>

// As section
<Card as="section" title="Features">
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
</Card>
```

### Interactive Cards

```tsx
const InteractiveCard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <Card.Title title="Expandable Content">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 hover:text-blue-700"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </Card.Title>

      <div>
        <p>Always visible content.</p>
        {expanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p>Additional content that can be toggled.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
```

### Card Grid Layout

```tsx
const CardGrid = () => {
  const items = [
    { id: 1, title: "Card 1", content: "Content 1" },
    { id: 2, title: "Card 2", content: "Content 2" },
    { id: 3, title: "Card 3", content: "Content 3" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} title={item.title}>
          <p>{item.content}</p>
        </Card>
      ))}
    </div>
  );
};
```

### Form Card

```tsx
<Card title="Contact Form">
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Name</label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Submit
    </button>
  </form>
</Card>
```

## Styling

The Card component includes:

- **Shadow**: Subtle shadow for depth (`shadow-shadow-card`)
- **Border**: Consistent border styling (`border-card-border`)
- **Background**: Card background color (`bg-card-background`)
- **Spacing**: Consistent padding and gaps
- **Rounded Corners**: Rounded corners (`rounded-card`)

## Data Attributes

- `data-component="card"`: Identifies the main card component
- `data-component="card-title"`: Identifies the title header
- `data-component="card-body"`: Identifies the content area

## Use Cases

### 1. **Dashboard Widgets**

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card title="Total Users">
    <div className="text-3xl font-bold">1,234</div>
    <div className="text-green-500">+12% from last month</div>
  </Card>

  <Card title="Revenue">
    <div className="text-3xl font-bold">$12,345</div>
    <div className="text-blue-500">+8% from last month</div>
  </Card>

  <Card title="Orders">
    <div className="text-3xl font-bold">567</div>
    <div className="text-red-500">-3% from last month</div>
  </Card>
</div>
```

### 2. **Content Sections**

```tsx
<Card title="About Us">
  <p>
    We are a company dedicated to providing excellent service and innovative
    solutions for our customers.
  </p>
  <div className="mt-4">
    <h4 className="font-semibold">Our Mission</h4>
    <p>To make technology accessible to everyone.</p>
  </div>
</Card>
```

### 3. **Product Cards**

```tsx
<Card>
  <Card.Title title="Premium Plan">
    <span className="text-2xl font-bold text-green-600">$29/mo</span>
  </Card.Title>

  <ul className="space-y-2">
    <li>✓ Unlimited projects</li>
    <li>✓ Priority support</li>
    <li>✓ Advanced analytics</li>
  </ul>

  <button className="w-full mt-4 py-2 bg-blue-500 text-white rounded">
    Choose Plan
  </button>
</Card>
```

### 4. **Settings Panels**

```tsx
<Card>
  <Card.Title title="Account Settings">
    <button className="text-sm text-blue-500">Reset to Default</button>
  </Card.Title>

  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span>Email Notifications</span>
      <input type="checkbox" />
    </div>
    <div className="flex justify-between items-center">
      <span>Dark Mode</span>
      <input type="checkbox" />
    </div>
  </div>
</Card>
```

## Accessibility

- Uses semantic HTML elements
- Proper heading hierarchy with customizable heading tags
- Supports keyboard navigation for interactive elements
- Screen reader friendly structure
- Maintains focus management

## Best Practices

1. **Consistent Spacing**: Use the built-in spacing for consistency
2. **Semantic Elements**: Use appropriate HTML elements with the `as` prop
3. **Title Hierarchy**: Use proper heading levels for titles
4. **Content Organization**: Group related content logically
5. **Responsive Design**: Consider mobile layouts for card grids

## Tailwind CSS v4 Integration

The Card component leverages Tailwind CSS v4's advanced features for enhanced layouts and responsive design.

### Using CSS Variables for Dynamic Theming

```tsx
// Card with custom theme using CSS variables
<Card
  title="Themed Card"
  className="bg-[--card-bg] border-[--card-border] shadow-[--card-shadow]"
  titleClassName="text-[--card-title-color] border-b-[--card-border]"
  style={{
    "--card-bg": "rgb(from theme(colors.slate.50) r g b / 0.8)",
    "--card-border": "theme(colors.blue.200)",
    "--card-shadow": "0 4px 6px rgb(from theme(colors.blue.500) r g b / 0.1)",
    "--card-title-color": "theme(colors.slate.800)",
  }}
>
  <p>Custom themed card content with CSS variables.</p>
</Card>
```

### Container Queries for Responsive Cards

```tsx
// Card that adapts layout based on container size
<div className="@container grid @sm:grid-cols-1 @lg:grid-cols-2 @xl:grid-cols-3 gap-6">
  <Card
    title="Responsive Card"
    className="@container"
    titleClassName="@sm:text-lg @lg:text-xl @xl:text-2xl"
  >
    <div className="@sm:space-y-2 @lg:space-y-4">
      <p className="@sm:text-sm @lg:text-base">
        This card adapts its typography and spacing based on container size.
      </p>
      <div className="@sm:flex-col @lg:flex-row flex gap-2">
        <button className="@sm:w-full @lg:w-auto px-3 py-1 bg-blue-500 text-white rounded">
          Action
        </button>
      </div>
    </div>
  </Card>
</div>
```

### Advanced Card Layouts with CSS Grid

```tsx
// Card with complex internal layout using CSS Grid areas
<Card
  className="@container [grid-template-areas:'header''content''actions'] grid-rows-[auto_1fr_auto] min-h-[300px]"
  header={
    <div className="[grid-area:header] p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
      <h2 className="text-xl font-bold">Grid Layout Card</h2>
    </div>
  }
>
  <div className="[grid-area:content] p-6 overflow-y-auto">
    <p>Main content area that can scroll if needed.</p>
    <div className="mt-4 space-y-2">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="p-2 bg-gray-50 rounded">
          Item {i + 1}
        </div>
      ))}
    </div>
  </div>

  <div className="[grid-area:actions] p-4 border-t bg-gray-50 flex justify-end gap-2">
    <button className="px-4 py-2 border border-gray-300 rounded hover:bg-white transition-colors">
      Cancel
    </button>
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Save
    </button>
  </div>
</Card>
```

### Dynamic Card Styling with Color Functions

```tsx
const StatusCard = ({ status = "active" }) => {
  const statusConfig = {
    active: { color: "green", icon: "✅" },
    warning: { color: "yellow", icon: "⚠️" },
    error: { color: "red", icon: "❌" },
    inactive: { color: "gray", icon: "⏸️" },
  };

  const config = statusConfig[status];

  return (
    <Card
      className="border-l-4 transition-all duration-300 hover:shadow-lg"
      style={{
        "--status-color": `theme(colors.${config.color}.500)`,
        "--status-bg": `color-mix(in srgb, theme(colors.${config.color}.50) 80%, white)`,
        borderLeftColor: "var(--status-color)",
        backgroundColor: "var(--status-bg)",
      }}
    >
      <Card.Title
        title={
          <div className="flex items-center gap-2">
            <span>{config.icon}</span>
            <span>Status: {status}</span>
          </div>
        }
      >
        <div
          className="px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: "var(--status-color)" }}
        >
          {status.toUpperCase()}
        </div>
      </Card.Title>

      <p>Card content with dynamic status styling.</p>
    </Card>
  );
};
```

### Responsive Card Grid with Auto-Fit

```tsx
// Self-organizing card grid using CSS Grid auto-fit
<div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
  {cards.map((card, index) => (
    <Card
      key={card.id}
      title={card.title}
      className="
        @container transition-all duration-300 
        hover:scale-105 hover:shadow-xl
        animate-[fadeInUp_0.6s_ease-out]
      "
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="@sm:space-y-2 @lg:space-y-4">
        <p className="@sm:text-sm @lg:text-base">{card.description}</p>
        <div className="flex @sm:flex-col @lg:flex-row gap-2">
          <button className="@sm:w-full @lg:w-auto px-3 py-1 bg-blue-500 text-white rounded">
            {card.action}
          </button>
        </div>
      </div>
    </Card>
  ))}
</div>
```

### Interactive Card with Modern Hover Effects

```tsx
// Card with advanced hover interactions
<Card
  className="
    @container group cursor-pointer transition-all duration-300
    hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50
    hover:border-blue-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
    hover:-translate-y-1
  "
  titleClassName="group-hover:text-blue-600 transition-colors duration-300"
  title="Interactive Card"
>
  <div className="space-y-4">
    <p className="group-hover:text-gray-700 transition-colors duration-300">
      This card has enhanced hover effects using Tailwind v4.
    </p>

    <div
      className="
      opacity-0 group-hover:opacity-100 
      transform translate-y-2 group-hover:translate-y-0
      transition-all duration-300 delay-100
    "
    >
      <button
        className="
        px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 
        text-white rounded-lg shadow-lg
        hover:from-blue-600 hover:to-purple-600
        transition-all duration-200
      "
      >
        Revealed Action
      </button>
    </div>
  </div>
</Card>
```

### Dashboard Card with Data Visualization

```tsx
const MetricCard = ({ title, value, change, trend }) => {
  const isPositive = change > 0;

  return (
    <Card
      className="@container relative overflow-hidden"
      title={title}
      titleClassName="text-sm font-medium text-gray-600"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,theme(colors.blue.500)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <div
              className={`
              flex items-center gap-1 text-sm font-medium
              ${isPositive ? "text-green-600" : "text-red-600"}
            `}
            >
              <span>{isPositive ? "↗" : "↘"}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          </div>

          {/* Mini trend chart using CSS */}
          <div className="flex items-end gap-1 h-8">
            {trend.map((point, index) => (
              <div
                key={index}
                className={`
                  w-2 rounded-t transition-all duration-300
                  ${isPositive ? "bg-green-400" : "bg-red-400"}
                `}
                style={{
                  height: `${(point / Math.max(...trend)) * 100}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
```

### Masonry Layout with Cards

```tsx
// Masonry-style layout using CSS Grid
<div
  className="
  grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] 
  gap-4 [grid-template-rows:masonry] 
  @supports_not_(grid-template-rows:masonry):[grid-template-rows:auto]
"
>
  {items.map((item, index) => (
    <Card
      key={item.id}
      title={item.title}
      className={`
        @container
        ${item.featured ? "row-span-2 bg-gradient-to-br from-blue-50 to-purple-50" : ""}
        animate-[fadeIn_0.6s_ease-out]
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`space-y-3 ${item.featured ? "@lg:space-y-6" : ""}`}>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        )}
        <p
          className={`@sm:text-sm ${item.featured ? "@lg:text-lg" : "@lg:text-base"}`}
        >
          {item.description}
        </p>
        {item.featured && (
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
              Featured Action
            </button>
          </div>
        )}
      </div>
    </Card>
  ))}
</div>
```

```css
/* Custom animations for cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## Notes

- The `title` prop creates an automatic header with consistent styling
- The `header` prop overrides the automatic title header
- Card.Title provides a flexible header with title and navigation areas
- The component is polymorphic and can render as any HTML element
- Responsive padding adjusts based on screen size (px-4 on mobile, px-8 on desktop)
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and color functions
- Enhanced with modern CSS Grid layouts and masonry support
- Supports complex hover interactions and animations
- Optimized for responsive design with container-based queries
