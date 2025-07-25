# Modal Component

A flexible modal dialog component with multiple display types (dialog, drawer, sheet), animations, and responsive behavior. Built with Floating UI for proper positioning and focus management.

## Import

```tsx
import { Modal } from "@g4rcez/components/modal";
```

## Basic Usage

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal open={isOpen} onChange={setIsOpen} title="Modal Title">
  <p>Modal content goes here.</p>
</Modal>;
```

## Props

| Prop                | Type                              | Default    | Description                                       |
| ------------------- | --------------------------------- | ---------- | ------------------------------------------------- |
| `open`              | `boolean`                         | -          | Controls modal visibility                         |
| `onChange`          | `(nextState: boolean) => void`    | -          | Callback when modal state changes                 |
| `title`             | `React.ReactNode`                 | -          | Modal title (creates header)                      |
| `ariaTitle`         | `string`                          | -          | ARIA label when no visible title                  |
| `footer`            | `React.ReactNode`                 | -          | Footer content                                    |
| `type`              | `"dialog" \| "drawer" \| "sheet"` | `"dialog"` | Modal display type                                |
| `position`          | `"left" \| "right"`               | `"right"`  | Drawer position (drawer type only)                |
| `animated`          | `boolean`                         | `true`     | Enable enter/exit animations                      |
| `closable`          | `boolean`                         | `true`     | Show close button                                 |
| `resizer`           | `boolean`                         | `true`     | Enable resize handle (drawer/sheet)               |
| `forceType`         | `boolean`                         | `false`    | Force type on mobile (ignore responsive behavior) |
| `overlayClickClose` | `boolean`                         | `false`    | Close on overlay click                            |
| `trigger`           | `React.ReactNode \| React.FC`     | -          | Trigger element                                   |
| `asChild`           | `boolean`                         | `false`    | Use trigger as child component                    |
| `className`         | `string`                          | -          | Additional classes for modal                      |
| `bodyClassName`     | `string`                          | -          | Additional classes for modal body                 |
| `overlayClassName`  | `string`                          | -          | Additional classes for overlay                    |
| `layoutId`          | `string`                          | -          | Layout ID for shared element transitions          |
| `role`              | `"dialog" \| "listbox"`           | `"dialog"` | ARIA role                                         |
| `interactions`      | `ElementProps[]`                  | `[]`       | Additional Floating UI interactions               |

## Modal Types

### Dialog (Default)

- Centered modal with backdrop
- Best for confirmations and forms
- Responsive: stays as dialog on all screen sizes

### Drawer

- Slides in from left or right side
- Full height, variable width
- Best for navigation or detailed content
- Responsive: becomes sheet on mobile

### Sheet

- Slides up from bottom
- Full width, variable height
- Best for mobile-first experiences
- Responsive: used as mobile fallback for drawers

## Examples

### Basic Dialog

```tsx
const BasicDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Dialog</button>

      <Modal open={open} onChange={setOpen} title="Confirm Action">
        <p>Are you sure you want to proceed?</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};
```

### Modal with Footer

```tsx
<Modal
  open={open}
  onChange={setOpen}
  title="User Profile"
  footer={
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setOpen(false)}
        className="px-4 py-2 border border-gray-300 rounded"
      >
        Cancel
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Save Changes
      </button>
    </div>
  }
>
  <form className="space-y-4">
    <div>
      <label>Name</label>
      <input type="text" className="w-full p-2 border rounded" />
    </div>
    <div>
      <label>Email</label>
      <input type="email" className="w-full p-2 border rounded" />
    </div>
  </form>
</Modal>
```

### Drawer Modal

```tsx
<Modal
  open={open}
  onChange={setOpen}
  type="drawer"
  position="right"
  title="Navigation"
>
  <nav className="space-y-2">
    <a href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">
      Dashboard
    </a>
    <a href="/profile" className="block p-2 hover:bg-gray-100 rounded">
      Profile
    </a>
    <a href="/settings" className="block p-2 hover:bg-gray-100 rounded">
      Settings
    </a>
  </nav>
</Modal>
```

### Sheet Modal

```tsx
<Modal open={open} onChange={setOpen} type="sheet" title="Quick Actions">
  <div className="grid grid-cols-2 gap-4">
    <button className="p-4 bg-blue-100 rounded text-center">
      <div className="text-2xl mb-2">📊</div>
      <div>Analytics</div>
    </button>
    <button className="p-4 bg-green-100 rounded text-center">
      <div className="text-2xl mb-2">💰</div>
      <div>Revenue</div>
    </button>
    <button className="p-4 bg-purple-100 rounded text-center">
      <div className="text-2xl mb-2">👥</div>
      <div>Users</div>
    </button>
    <button className="p-4 bg-orange-100 rounded text-center">
      <div className="text-2xl mb-2">⚙️</div>
      <div>Settings</div>
    </button>
  </div>
</Modal>
```

### Modal with Trigger

```tsx
<Modal
  open={open}
  onChange={setOpen}
  title="Settings"
  trigger={
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Open Settings
    </button>
  }
>
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span>Dark Mode</span>
      <input type="checkbox" />
    </div>
    <div className="flex justify-between items-center">
      <span>Notifications</span>
      <input type="checkbox" />
    </div>
  </div>
</Modal>
```

### Modal with Custom Trigger (asChild)

```tsx
<Modal
  open={open}
  onChange={setOpen}
  title="Custom Trigger"
  asChild
  trigger={
    <div className="p-4 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
      Click anywhere in this area to open modal
    </div>
  }
>
  <p>Modal opened with custom trigger area.</p>
</Modal>
```

### Resizable Drawer

```tsx
<Modal
  open={open}
  onChange={setOpen}
  type="drawer"
  position="left"
  title="Resizable Sidebar"
  resizer={true}
>
  <div className="space-y-4">
    <p>This drawer can be resized by dragging the handle.</p>
    <div className="h-64 bg-gray-100 rounded">Content area</div>
  </div>
</Modal>
```

### Overlay Click to Close

```tsx
<Modal
  open={open}
  onChange={setOpen}
  title="Click Outside to Close"
  overlayClickClose={true}
>
  <p>Click on the backdrop/overlay to close this modal.</p>
</Modal>
```

### Non-closable Modal

```tsx
<Modal open={open} onChange={setOpen} title="Processing..." closable={false}>
  <div className="text-center">
    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
    <p>Please wait while we process your request.</p>
  </div>
</Modal>
```

### Form Modal with Validation

```tsx
const FormModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit form
      setOpen(false);
    }
  };

  return (
    <Modal
      open={open}
      onChange={setOpen}
      title="Add User"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add User
          </button>
        </div>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};
```

## Responsive Behavior

The Modal component automatically adapts to different screen sizes:

- **Desktop (≥1024px)**: Uses specified type (dialog, drawer, sheet)
- **Mobile (<1024px)**: Converts drawers to sheets for better mobile UX
- **Force Type**: Use `forceType={true}` to disable responsive behavior

## Animations

Built-in animations for all modal types:

### Dialog

- **Enter**: Scale up from 95% with fade in
- **Exit**: Scale down to 95% with fade out

### Drawer

- **Enter**: Slide in from specified side
- **Exit**: Slide out to specified side

### Sheet

- **Enter**: Slide up from bottom
- **Exit**: Slide down to bottom

## Drag Interactions

Drawers and sheets support drag-to-resize/close:

- **Drawers**: Drag horizontal handle to resize width
- **Sheets**: Drag vertical handle to resize height or close
- **Auto-close**: Dragging beyond threshold closes the modal

## Accessibility

- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: ESC key to close, tab navigation
- **ARIA Attributes**: Proper modal, dialog, and labeling
- **Screen Readers**: Announced when opened/closed
- **Focus Guards**: Prevents focus from escaping modal

## Use Cases

### 1. **Confirmation Dialogs**

```tsx
<Modal open={open} onChange={setOpen} title="Delete Item">
  <p>
    Are you sure you want to delete this item? This action cannot be undone.
  </p>
</Modal>
```

### 2. **Form Modals**

```tsx
<Modal open={open} onChange={setOpen} title="Create New Project">
  <ProjectForm onSubmit={handleSubmit} />
</Modal>
```

### 3. **Navigation Drawers**

```tsx
<Modal open={open} onChange={setOpen} type="drawer" title="Menu">
  <NavigationMenu />
</Modal>
```

### 4. **Mobile Action Sheets**

```tsx
<Modal open={open} onChange={setOpen} type="sheet" title="Actions">
  <ActionButtons />
</Modal>
```

## Best Practices

1. **Appropriate Type**: Choose the right modal type for the content
2. **Focus Management**: Ensure proper focus handling
3. **Escape Routes**: Always provide a way to close the modal
4. **Content Size**: Consider content size and scrolling
5. **Mobile Experience**: Test on mobile devices
6. **Accessibility**: Include proper ARIA labels and keyboard support

## Tailwind CSS v4 Integration

The Modal component takes full advantage of Tailwind CSS v4's new features for enhanced styling and responsive behavior.

### Using CSS Variables for Dynamic Theming

```tsx
// Modal with custom theme using CSS variables
<Modal
  open={open}
  onChange={setOpen}
  title="Custom Themed Modal"
  className="bg-[--modal-bg] border-[--modal-border]"
  overlayClassName="bg-[--overlay-color]"
  style={{
    "--modal-bg": "rgb(from theme(colors.slate.900) r g b / 0.95)",
    "--modal-border": "theme(colors.blue.500)",
    "--overlay-color": "rgb(from theme(colors.black) r g b / 0.6)",
  }}
>
  <p
    className="text-[--modal-text]"
    style={{ "--modal-text": "theme(colors.slate.100)" }}
  >
    Custom themed modal content
  </p>
</Modal>
```

### Container Queries for Responsive Modals

```tsx
// Modal that adapts based on container size
<Modal
  open={open}
  onChange={setOpen}
  title="Responsive Modal"
  className="@container @sm:max-w-md @lg:max-w-2xl @xl:max-w-4xl"
  bodyClassName="@sm:p-4 @lg:p-6 @xl:p-8"
>
  <div className="grid @sm:grid-cols-1 @lg:grid-cols-2 gap-4">
    <div className="@lg:col-span-1">
      <h3 className="@sm:text-lg @lg:text-xl">Content Section 1</h3>
      <p className="@sm:text-sm @lg:text-base">
        Responsive content that adapts to modal size.
      </p>
    </div>
    <div className="@lg:col-span-1">
      <h3 className="@sm:text-lg @lg:text-xl">Content Section 2</h3>
      <p className="@sm:text-sm @lg:text-base">More responsive content.</p>
    </div>
  </div>
</Modal>
```

### Advanced Drawer Styling with CSS Grid

```tsx
// Drawer with complex layout using CSS Grid areas
<Modal
  open={open}
  onChange={setOpen}
  type="drawer"
  position="right"
  title="Navigation Drawer"
  className="[grid-template-areas:'header''nav''footer'] grid-rows-[auto_1fr_auto] min-h-screen"
  bodyClassName="[grid-area:nav] overflow-y-auto"
>
  <nav className="space-y-2">
    <a
      href="#"
      className="block p-3 rounded-lg hover:bg-[color-mix(in_srgb,theme(colors.blue.500)_10%,transparent)] transition-colors"
    >
      Dashboard
    </a>
    <a
      href="#"
      className="block p-3 rounded-lg hover:bg-[color-mix(in_srgb,theme(colors.blue.500)_10%,transparent)] transition-colors"
    >
      Projects
    </a>
    <a
      href="#"
      className="block p-3 rounded-lg hover:bg-[color-mix(in_srgb,theme(colors.blue.500)_10%,transparent)] transition-colors"
    >
      Settings
    </a>
  </nav>
</Modal>
```

### Sheet Modal with Modern Animations

```tsx
// Sheet modal with custom animations using Tailwind v4
<Modal
  open={open}
  onChange={setOpen}
  type="sheet"
  title="Action Sheet"
  className="animate-[slideUp_0.3s_ease-out] backdrop-blur-sm"
  overlayClassName="bg-[color-mix(in_srgb,theme(colors.black)_40%,transparent)]"
>
  <div className="grid grid-cols-2 gap-4">
    {actions.map((action, index) => (
      <button
        key={action.id}
        className="
          p-4 rounded-xl border border-gray-200 
          hover:bg-[color-mix(in_srgb,theme(colors.gray.100)_80%,transparent)]
          hover:scale-105 transition-[background-color,transform] duration-200
          animate-[fadeInUp_0.4s_ease-out] 
        "
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="text-2xl mb-2">{action.icon}</div>
        <div className="font-medium">{action.label}</div>
      </button>
    ))}
  </div>
</Modal>
```

```css
/* Custom animations for sheet modal */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

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
```

### Dynamic Modal Sizing with CSS Functions

```tsx
const DynamicModal = ({ size = "md" }) => {
  const sizeConfig = {
    sm: { width: "320px", height: "240px" },
    md: { width: "480px", height: "360px" },
    lg: { width: "640px", height: "480px" },
    xl: { width: "800px", height: "600px" },
  };

  return (
    <Modal
      open={open}
      onChange={setOpen}
      title="Dynamic Size Modal"
      className="transition-all duration-300 ease-in-out"
      style={{
        "--modal-width": sizeConfig[size].width,
        "--modal-height": sizeConfig[size].height,
        width: "min(var(--modal-width), 90vw)",
        height: "min(var(--modal-height), 80vh)",
      }}
    >
      <div className="h-full flex items-center justify-center">
        <p>Modal size: {size}</p>
      </div>
    </Modal>
  );
};
```

### Multi-Modal Management with Z-Index Layers

```tsx
// System for managing multiple modals with proper layering
const ModalManager = () => {
  const [modals, setModals] = useState([]);

  const openModal = (modalConfig) => {
    setModals((prev) => [...prev, { ...modalConfig, id: Date.now() }]);
  };

  return (
    <>
      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          open={true}
          onChange={() =>
            setModals((prev) => prev.filter((m) => m.id !== modal.id))
          }
          title={modal.title}
          overlayClassName={`bg-black/20 backdrop-blur-[1px]`}
          className="relative"
          style={{
            "--modal-z": 1000 + index * 10,
            zIndex: "var(--modal-z)",
          }}
        >
          {modal.content}
        </Modal>
      ))}
    </>
  );
};
```

### Responsive Modal with Breakpoint-Specific Behavior

```tsx
// Modal that changes type based on screen size
<Modal
  open={open}
  onChange={setOpen}
  title="Adaptive Modal"
  type="dialog"
  forceType={false} // Allow responsive behavior
  className="
    @container
    @sm:max-w-sm @sm:mx-4
    @md:max-w-md @md:mx-auto
    @lg:max-w-lg
    @xl:max-w-xl
  "
  bodyClassName="
    @sm:p-4 @sm:text-sm
    @md:p-6 @md:text-base
    @lg:p-8 @lg:text-lg
  "
>
  <div className="space-y-4">
    <p className="@sm:text-sm @md:text-base @lg:text-lg">
      This modal adapts its size and typography based on the container size.
    </p>
    <div className="grid @sm:grid-cols-1 @md:grid-cols-2 gap-4">
      <button className="@sm:text-xs @md:text-sm @lg:text-base p-2 bg-blue-500 text-white rounded">
        Action 1
      </button>
      <button className="@sm:text-xs @md:text-sm @lg:text-base p-2 bg-gray-500 text-white rounded">
        Action 2
      </button>
    </div>
  </div>
</Modal>
```

### Form Modal with Enhanced Validation Styling

```tsx
const FormModal = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  return (
    <Modal
      open={open}
      onChange={setOpen}
      title="Enhanced Form Modal"
      className="@container"
      footer={
        <div className="flex gap-3 @sm:flex-col @md:flex-row">
          <button className="@sm:w-full @md:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="@sm:w-full @md:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
            Submit
          </button>
        </div>
      }
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className={`
              w-full p-3 rounded-lg border-2 transition-all duration-200
              ${
                errors.name
                  ? "border-red-400 bg-red-50 animate-[shake_0.5s_ease-in-out]"
                  : "border-gray-200 focus:border-blue-400 focus:bg-blue-50"
              }
            `}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm animate-[slideDown_0.3s_ease-out]">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:bg-blue-50 transition-all duration-200"
            placeholder="Enter your email"
          />
        </div>
      </form>
    </Modal>
  );
};
```

## Notes

- Uses Floating UI for positioning and interactions
- Automatically manages scroll locking when open
- Supports portal rendering for proper z-index stacking
- Animations can be disabled with `animated={false}`
- The component forwards refs for external access
- Supports shared element transitions with `layoutId`
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and color functions
- Enhanced with modern CSS animations and responsive behavior
- Supports complex layouts with CSS Grid areas and custom properties
