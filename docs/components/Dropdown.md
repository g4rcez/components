# Dropdown Component

A floating dropdown component with customizable trigger and content area. Built on Floating UI for proper positioning with automatic flip and shift behaviors.

## Import

```tsx
import { Dropdown } from "@g4rcez/components/dropdown";
```

## Basic Usage

```tsx
<Dropdown
  trigger={<button>Click me</button>}
  title="Dropdown Title"
>
  <div className="p-4">
    <p>Dropdown content goes here</p>
  </div>
</Dropdown>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `React.ReactElement \| React.ReactNode` | - | Element that triggers the dropdown |
| `open` | `boolean` | - | Controlled open state |
| `arrow` | `boolean` | `false` | Show arrow pointer |
| `title` | `React.ReactNode \| React.ReactElement \| string` | - | Header title |
| `restoreFocus` | `boolean` | `true` | Restore focus on close |
| `returnFocus` | `boolean` | `true` | Return focus to trigger |
| `onChange` | `(nextValue: boolean) => void` | - | Open state change handler |
| `buttonProps` | `React.ComponentProps<"button">` | - | Additional trigger button props |
| `children` | `React.ReactNode` | - | Dropdown content |

## Examples

### Simple Dropdown Menu

```tsx
function SimpleDropdown() {
  return (
    <Dropdown
      trigger={
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Actions
        </button>
      }
    >
      <div className="py-1 min-w-48">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Edit
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Duplicate
        </button>
        <hr className="my-1" />
        <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
          Delete
        </button>
      </div>
    </Dropdown>
  );
}
```

### Dropdown with Title

```tsx
function DropdownWithTitle() {
  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 border rounded">
          <UserIcon className="w-4 h-4" />
          Account
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      }
      title="Account Options"
    >
      <div className="py-1 min-w-48">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Profile Settings
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Billing
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Sign Out
        </button>
      </div>
    </Dropdown>
  );
}
```

### Dropdown with Arrow

```tsx
<Dropdown
  trigger={<button>Options</button>}
  arrow
  title="Menu Options"
>
  <div className="p-4">
    <p>Content with arrow pointer</p>
  </div>
</Dropdown>
```

### Controlled Dropdown

```tsx
function ControlledDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <p>Dropdown is {isOpen ? 'open' : 'closed'}</p>
      
      <Dropdown
        trigger={
          <button className="px-4 py-2 bg-gray-200 rounded">
            {isOpen ? 'Close' : 'Open'} Menu
          </button>
        }
        open={isOpen}
        onChange={setIsOpen}
      >
        <div className="p-4 min-w-48">
          <p>Controlled dropdown content</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Close
          </button>
        </div>
      </Dropdown>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Toggle from Outside
      </button>
    </div>
  );
}
```

### User Profile Dropdown

```tsx
function UserProfileDropdown() {
  const user = { name: "John Doe", email: "john@example.com", avatar: "/avatar.jpg" };

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
      }
      title="Account"
      arrow
    >
      <div className="min-w-64">
        {/* User info */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-1">
          <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Profile
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4" />
            Billing
          </button>
          <hr className="my-1" />
          <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600">
            <LogOutIcon className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </Dropdown>
  );
}
```

### Context Menu Dropdown

```tsx
function ContextMenuDropdown({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown
      trigger={
        <div className="relative group">
          {children}
          <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="py-1 min-w-32">
        <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100">
          Edit
        </button>
        <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100">
          Copy
        </button>
        <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100">
          Move
        </button>
        <hr className="my-1" />
        <button className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100">
          Delete
        </button>
      </div>
    </Dropdown>
  );
}

// Usage
<ContextMenuDropdown>
  <div className="p-4 border rounded">
    <h3>Item Title</h3>
    <p>Item description</p>
  </div>
</ContextMenuDropdown>
```

### Dropdown with Form

```tsx
function FilterDropdown() {
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    dateRange: ''
  });

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 border rounded">
          <FilterIcon className="w-4 h-4" />
          Filters
          {Object.values(filters).some(v => v) && (
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>
      }
      title="Filter Options"
    >
      <div className="p-4 min-w-64 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => setFilters({ status: '', category: '', dateRange: '' })}
            className="px-3 py-1 text-sm border rounded"
          >
            Clear
          </button>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
            Apply
          </button>
        </div>
      </div>
    </Dropdown>
  );
}
```

### Dropdown with Custom Trigger

```tsx
function CustomTriggerDropdown() {
  return (
    <Dropdown
      trigger={
        <div className="cursor-pointer">
          <div className="flex items-center gap-2 p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">JD</span>
            </div>
            <div className="text-left">
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-500">john@example.com</div>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </div>
      }
      arrow
    >
      <div className="min-w-48 py-1">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          View Profile
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Edit Profile
        </button>
        <hr className="my-1" />
        <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
          Sign Out
        </button>
      </div>
    </Dropdown>
  );
}
```

### Nested Dropdown (Submenu)

```tsx
function NestedDropdown() {
  return (
    <Dropdown
      trigger={<button className="px-4 py-2 border rounded">Main Menu</button>}
    >
      <div className="py-1 min-w-48">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Home
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          About
        </button>
        
        {/* Nested dropdown */}
        <Dropdown
          trigger={
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between">
              Services
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          }
        >
          <div className="py-1 min-w-40">
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
              Web Development
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
              Design
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
              Consulting
            </button>
          </div>
        </Dropdown>
        
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Contact
        </button>
      </div>
    </Dropdown>
  );
}
```

## Positioning

The Dropdown uses Floating UI for automatic positioning:

- **Auto-flip**: Flips to the opposite side when there's no space
- **Auto-shift**: Shifts position to stay within viewport
- **Collision Detection**: Avoids clipping at viewport edges
- **Arrow Positioning**: Arrow automatically adjusts position

## Focus Management

- **Focus Restoration**: Returns focus to trigger when closed
- **Keyboard Navigation**: Tab navigation within dropdown
- **Click Outside**: Closes when clicking outside
- **Escape Key**: Closes on ESC key press

## Accessibility

- **ARIA Roles**: Proper button and menu roles
- **Keyboard Support**: Enter/Space to open, ESC to close  
- **Focus Indicators**: Clear focus states
- **Screen Reader Support**: Announces state changes

```tsx
<Dropdown
  trigger={
    <button aria-label="Open user menu">
      User Menu
    </button>
  }
  title="User Account Options"
>
  {/* Accessible menu items */}
</Dropdown>
```

## Styling

The Dropdown supports custom styling through CSS classes:

```css
/* Custom dropdown styling */
.dropdown-content {
  @apply bg-white border border-gray-200 rounded-lg shadow-lg;
  @apply min-w-48 max-w-sm;
}

.dropdown-item {
  @apply px-4 py-2 hover:bg-gray-50 cursor-pointer;
  @apply transition-colors duration-150;
}
```

## Related Components

- **CommandPalette**: For searchable command interfaces
- **Menu**: For context menus  
- **Tooltip**: For simple hover information
- **Modal**: For more complex overlays