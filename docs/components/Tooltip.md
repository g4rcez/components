# Tooltip Component

A polymorphic tooltip component with multiple interaction modes including hover, focus, and click. Built on Floating UI for precise positioning and includes cursor following capabilities.

## Import

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";
```

## Basic Usage

```tsx
<Tooltip title="Click me for more info">
  <button>Hover for tooltip</button>
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `Label` | - | Tooltip trigger content |
| `open` | `boolean` | - | Controlled open state |
| `enabled` | `boolean` | `true` | Enable/disable tooltip |
| `hover` | `boolean` | `true` | Enable hover trigger |
| `focus` | `boolean` | `true` | Enable focus trigger |
| `popover` | `boolean` | `true` | Enable click trigger |
| `placement` | `Placement` | `"top"` | Tooltip placement |
| `followCursor` | `boolean` | `false` | Follow mouse cursor |
| `onChange` | `(open: boolean) => void` | - | Open state change handler |
| `as` | `React.ElementType` | `"span"` | HTML element to render as |
| `children` | `React.ReactNode` | - | Tooltip content |

## Examples

### Basic Tooltips

```tsx
function BasicTooltips() {
  return (
    <div className="space-x-4">
      {/* Default hover tooltip */}
      <Tooltip title="This is a helpful tooltip">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Hover me
        </button>
      </Tooltip>

      {/* Tooltip with custom placement */}
      <Tooltip title="I appear below" placement="bottom">
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          Bottom tooltip
        </button>
      </Tooltip>

      {/* Tooltip on left */}
      <Tooltip title="Left side tooltip" placement="left">
        <button className="px-4 py-2 bg-purple-500 text-white rounded">
          Left tooltip
        </button>
      </Tooltip>
    </div>
  );
}
```

### Interaction Modes

```tsx
function TooltipInteractionModes() {
  return (
    <div className="space-y-4">
      {/* Hover only */}
      <Tooltip 
        title="Hover only tooltip"
        hover={true}
        focus={false}
        popover={false}
      >
        <button className="px-4 py-2 border rounded">
          Hover Only
        </button>
      </Tooltip>

      {/* Focus only (keyboard accessible) */}
      <Tooltip 
        title="Focus to show tooltip"
        hover={false}
        focus={true}
        popover={false}
      >
        <input 
          placeholder="Focus me with tab"
          className="px-3 py-2 border rounded"
        />
      </Tooltip>

      {/* Click only */}
      <Tooltip 
        title="Click to toggle tooltip"
        hover={false}
        focus={false}
        popover={true}
      >
        <button className="px-4 py-2 bg-orange-500 text-white rounded">
          Click Only
        </button>
      </Tooltip>

      {/* All interactions */}
      <Tooltip 
        title="Hover, focus, or click"
        hover={true}
        focus={true}
        popover={true}
      >
        <button className="px-4 py-2 bg-gray-500 text-white rounded">
          All Interactions
        </button>
      </Tooltip>
    </div>
  );
}
```

### Cursor Following Tooltip

```tsx
function CursorFollowingTooltip() {
  return (
    <div className="p-8 border rounded-lg">
      <Tooltip 
        title="I follow your cursor!"
        followCursor={true}
        placement="top-start"
      >
        <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
          <span className="text-gray-600">Move your mouse over this area</span>
        </div>
      </Tooltip>
    </div>
  );
}
```

### Rich Content Tooltips

```tsx
function RichContentTooltips() {
  return (
    <div className="space-x-4">
      {/* Tooltip with complex content */}
      <Tooltip
        title={
          <div className="max-w-xs">
            <div className="font-semibold text-white mb-1">User Profile</div>
            <div className="flex items-center gap-2 mb-2">
              <img 
                src="/avatar.jpg" 
                alt="User" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="text-sm text-white">John Doe</div>
                <div className="text-xs text-gray-300">Software Engineer</div>
              </div>
            </div>
            <div className="text-sm text-gray-200">
              Click to view full profile
            </div>
          </div>
        }
        placement="bottom"
      >
        <button className="flex items-center gap-2 px-3 py-2 border rounded">
          <UserIcon className="w-4 h-4" />
          Profile Info
        </button>
      </Tooltip>

      {/* Tooltip with action buttons */}
      <Tooltip
        title={
          <div className="space-y-2">
            <div className="text-sm font-medium text-white mb-2">Quick Actions</div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                Edit
              </button>
              <button className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                Share
              </button>
              <button className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                Delete
              </button>
            </div>
          </div>
        }
        hover={false}
        popover={true}
      >
        <button className="px-4 py-2 bg-gray-600 text-white rounded">
          Actions Menu
        </button>
      </Tooltip>
    </div>
  );
}
```

### Controlled Tooltips

```tsx
function ControlledTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm text-gray-600">
          Tooltip is: {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <Tooltip
        title="This is a controlled tooltip"
        open={isOpen}
        onChange={setIsOpen}
        hover={false} // Disable automatic triggers
        focus={false}
        popover={false}
      >
        <button className="px-4 py-2 border rounded">
          Controlled Target
        </button>
      </Tooltip>

      <div className="space-x-2">
        <button 
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Show
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Hide
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
```

### Form Field Tooltips

```tsx
function FormWithTooltips() {
  return (
    <form className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">
          Username
          <Tooltip title="Username must be 3-20 characters long and contain only letters, numbers, and underscores">
            <InfoIcon className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
          </Tooltip>
        </label>
        <input 
          type="text"
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Password
          <Tooltip title="Password must be at least 8 characters with uppercase, lowercase, number, and special character">
            <InfoIcon className="inline w-4 h-4 ml-1 text-gray-400 cursor-help" />
          </Tooltip>
        </label>
        <input 
          type="password"
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
        />
      </div>

      <div>
        <Tooltip title="By submitting this form, you agree to our Terms of Service and Privacy Policy">
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Account
          </button>
        </Tooltip>
      </div>
    </form>
  );
}
```

### Data Visualization Tooltips

```tsx
function DataVisualizationTooltips() {
  const data = [
    { label: "Sales", value: 12500, change: "+12%" },
    { label: "Users", value: 8420, change: "+8%" },
    { label: "Revenue", value: 45300, change: "-2%" },
    { label: "Orders", value: 1240, change: "+15%" }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item, index) => (
        <Tooltip
          key={index}
          title={
            <div>
              <div className="text-sm font-medium text-white">{item.label} Details</div>
              <div className="text-xs text-gray-200 mt-1">
                Current: {item.value.toLocaleString()}<br/>
                Change: {item.change} from last month<br/>
                Trend: {item.change.startsWith('+') ? 'Increasing' : 'Decreasing'}
              </div>
            </div>
          }
          placement="top"
        >
          <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
            <div className="text-sm text-gray-600">{item.label}</div>
            <div className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {item.change}
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
```

### Polymorphic Tooltips

```tsx
function PolymorphicTooltips() {
  return (
    <div className="space-y-4">
      {/* As a div */}
      <Tooltip 
        as="div" 
        title="This is a div with tooltip"
        className="inline-block p-3 bg-gray-100 rounded"
      >
        Div with tooltip
      </Tooltip>

      {/* As a paragraph */}
      <Tooltip 
        as="p" 
        title="Paragraph tooltip"
        className="text-blue-600 cursor-pointer"
      >
        This paragraph has a tooltip
      </Tooltip>

      {/* As a custom component */}
      <Tooltip 
        as="article"
        title="Article tooltip"
        className="border p-4 rounded"
      >
        <h3 className="font-bold">Article Title</h3>
        <p>Article content with tooltip on the entire article element.</p>
      </Tooltip>
    </div>
  );
}
```

### Conditional Tooltips

```tsx
function ConditionalTooltips() {
  const [showTooltips, setShowTooltips] = useState(true);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input 
          type="checkbox"
          checked={showTooltips}
          onChange={(e) => setShowTooltips(e.target.checked)}
        />
        Enable tooltips
      </label>

      <div className="space-x-4">
        <Tooltip 
          title="This tooltip can be disabled"
          enabled={showTooltips}
        >
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Conditional Tooltip
          </button>
        </Tooltip>

        <Tooltip 
          title="This one too"
          enabled={showTooltips}
        >
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Another One
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
```

## Placement Options

The tooltip supports all Floating UI placement options:

- `"top"`, `"top-start"`, `"top-end"`
- `"bottom"`, `"bottom-start"`, `"bottom-end"`  
- `"left"`, `"left-start"`, `"left-end"`
- `"right"`, `"right-start"`, `"right-end"`

```tsx
<Tooltip title="Custom placement" placement="bottom-end">
  <button>Bottom-end tooltip</button>
</Tooltip>
```

## Safe Area Navigation

The tooltip includes safe polygon navigation for complex content:

```tsx
<Tooltip 
  title={
    <div className="p-2">
      <p>Complex content with links</p>
      <a href="#" className="text-blue-400 hover:underline">
        Clickable link
      </a>
    </div>
  }
>
  <button>Tooltip with interactive content</button>
</Tooltip>
```

## Styling

```css
/* Custom tooltip styling */
.tooltip-content {
  @apply bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow-lg;
  @apply max-w-xs break-words;
}

.tooltip-arrow {
  @apply fill-gray-900;
}
```

## Accessibility

- **ARIA Labels**: Proper tooltip labeling
- **Keyboard Navigation**: Focus trigger support
- **Screen Reader Support**: Announces tooltip content
- **High Contrast**: Sufficient color contrast
- **Focus Indicators**: Clear focus states

```tsx
<Tooltip 
  title="Accessible tooltip"
  aria-label="Additional information"
>
  <button aria-describedby="tooltip-content">
    Accessible Button
  </button>
</Tooltip>
```

## Performance

- **Lazy Loading**: Content rendered only when needed
- **Optimized Positioning**: Efficient Floating UI calculations  
- **Event Cleanup**: Proper cleanup of event listeners
- **Minimal Re-renders**: Optimized with React.memo

## Related Components

- **Dropdown**: For clickable menus
- **Popover**: For complex interactive content
- **Alert**: For persistent messages
- **Modal**: For blocking interactions