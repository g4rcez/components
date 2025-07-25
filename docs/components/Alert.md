# Alert Component

A flexible alert component for displaying important messages, notifications, and status updates. Features collapsible animation, custom icons, and multiple theme variants.

## Import

```tsx
import { Alert } from "@g4rcez/components/alert";
```

## Basic Usage

```tsx
<Alert theme="info" title="Information">
  This is an informational message.
</Alert>
```

## Props

| Prop        | Type                                                                                 | Default     | Description                                 |
| ----------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------------------- |
| `theme`     | `"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "neutral"` | `"neutral"` | Visual theme/variant of the alert           |
| `title`     | `string`                                                                             | -           | Alert title/heading                         |
| `Icon`      | `React.ReactElement`                                                                 | -           | Custom icon (overrides default theme icons) |
| `open`      | `boolean`                                                                            | `true`      | Controls alert visibility with animation    |
| `onClose`   | `(nextState: boolean) => void`                                                       | -           | Callback when close button is clicked       |
| `container` | `string`                                                                             | -           | Additional container classes                |
| `as`        | `React.ElementType`                                                                  | `"div"`     | HTML element to render as                   |
| `className` | `string`                                                                             | -           | Additional CSS classes                      |
| `children`  | `React.ReactNode`                                                                    | -           | Alert content/message                       |

## Theme Variants

- **primary**: Primary brand color scheme
- **secondary**: Secondary color scheme
- **info**: Information/neutral styling (blue theme)
- **warn**: Warning/caution styling (yellow/orange theme)
- **danger**: Error/destructive styling (red theme)
- **success**: Success/positive styling (green theme)
- **neutral**: Minimal styling with border

## Default Icons

Each theme has a default icon that appears automatically:

- **success**: CheckCircleIcon
- **info**: InfoIcon
- **danger**: TriangleAlertIcon
- **warn**: No default icon
- **primary/secondary/neutral**: No default icon

## Examples

### Basic Variants

```tsx
<Alert theme="info" title="Information">
  This is an informational message.
</Alert>

<Alert theme="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

<Alert theme="warn" title="Warning">
  Please review your input before proceeding.
</Alert>

<Alert theme="danger" title="Error">
  Something went wrong. Please try again.
</Alert>
```

### With Custom Icons

```tsx
import { BellIcon, ShieldIcon } from "lucide-react";

<Alert
  theme="info"
  title="Notification"
  Icon={<BellIcon size={20} />}
>
  You have new messages.
</Alert>

<Alert
  theme="warn"
  title="Security Alert"
  Icon={<ShieldIcon size={20} />}
>
  Suspicious activity detected on your account.
</Alert>
```

### Dismissible Alerts

```tsx
const [showAlert, setShowAlert] = useState(true);

<Alert
  theme="success"
  title="Welcome!"
  open={showAlert}
  onClose={() => setShowAlert(false)}
>
  Thanks for joining our platform.
</Alert>;
```

### Controlled Visibility

```tsx
const [alerts, setAlerts] = useState({
  info: true,
  warning: true,
  error: false,
});

const closeAlert = (type) => {
  setAlerts((prev) => ({ ...prev, [type]: false }));
};

<>
  <Alert
    theme="info"
    title="System Update"
    open={alerts.info}
    onClose={() => closeAlert("info")}
  >
    System maintenance scheduled for tonight.
  </Alert>

  <Alert
    theme="warn"
    title="Storage Warning"
    open={alerts.warning}
    onClose={() => closeAlert("warning")}
  >
    You're running low on storage space.
  </Alert>
</>;
```

### Without Titles

```tsx
<Alert theme="success">
  Operation completed successfully!
</Alert>

<Alert theme="danger">
  <strong>Error:</strong> Unable to process your request.
</Alert>
```

### Rich Content

```tsx
<Alert theme="info" title="Update Available">
  <p>A new version of the application is available.</p>
  <div className="mt-3 flex gap-2">
    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
      Update Now
    </button>
    <button className="px-3 py-1 border border-gray-300 rounded text-sm">
      Later
    </button>
  </div>
</Alert>
```

### Form Validation Alerts

```tsx
const FormWithValidation = () => {
  const [errors, setErrors] = useState([]);

  return (
    <form>
      {errors.length > 0 && (
        <Alert theme="danger" title="Validation Errors">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Form fields */}
    </form>
  );
};
```

### Notification System

```tsx
const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, title, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          theme={notification.type}
          title={notification.title}
          open={true}
          onClose={() => removeNotification(notification.id)}
          className="min-w-[300px]"
        >
          {notification.message}
        </Alert>
      ))}
    </div>
  );
};
```

## Animation

The Alert component includes smooth collapse/expand animations:

- **Enter**: Fades in with height animation
- **Exit**: Fades out and collapses height
- **Duration**: 0.7 seconds with smooth easing
- **Layout**: Prevents layout shift during animation

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Proper heading structure with semantic `h4` elements
- Keyboard accessible close button
- High contrast colors for all theme variants
- Focus management for interactive elements
- ARIA attributes for state management

## Styling

The Alert component uses Tailwind CSS classes and supports:

- Responsive design with proper spacing
- Smooth animations and transitions
- Theme-based color schemes
- Custom className override
- Consistent typography and spacing

## Data Attributes

- `data-component="alert"`: Identifies the component
- `data-theme`: Current theme variant
- `data-open`: Visibility state (true/false)

## Use Cases

### 1. **Form Validation**

```tsx
<Alert theme="danger" title="Please fix the following errors:">
  <ul>
    <li>Email is required</li>
    <li>Password must be at least 8 characters</li>
  </ul>
</Alert>
```

### 2. **System Status**

```tsx
<Alert theme="warn" title="Maintenance Mode">
  The system will be under maintenance from 2:00 AM to 4:00 AM UTC.
</Alert>
```

### 3. **Success Feedback**

```tsx
<Alert theme="success" title="Profile Updated">
  Your profile information has been successfully updated.
</Alert>
```

### 4. **Information Display**

```tsx
<Alert theme="info" title="New Features">
  Check out our latest features in the dashboard.
</Alert>
```

## Best Practices

1. **Appropriate Themes**: Use themes that match the message severity
2. **Clear Titles**: Provide descriptive titles for better understanding
3. **Actionable Content**: Include relevant actions when appropriate
4. **Auto-dismiss**: Consider auto-dismissing non-critical alerts
5. **Positioning**: Place alerts where users expect to see them
6. **Accessibility**: Ensure alerts are announced to screen readers

## Tailwind CSS v4 Integration

The Alert component takes advantage of Tailwind CSS v4's modern features for enhanced styling and animations.

### Using CSS Variables for Dynamic Theming

```tsx
// Alert with custom theme using CSS variables
<Alert
  theme="neutral"
  title="Custom Themed Alert"
  className="bg-[--alert-bg] border-[--alert-border] text-[--alert-text]"
  style={{
    "--alert-bg": "color-mix(in srgb, theme(colors.purple.50) 90%, white)",
    "--alert-border": "theme(colors.purple.300)",
    "--alert-text": "theme(colors.purple.900)",
  }}
>
  This alert uses custom CSS variables for theming.
</Alert>
```

### Container Queries for Responsive Alerts

```tsx
// Alert that adapts based on container size
<div className="@container max-w-2xl mx-auto">
  <Alert
    theme="info"
    title="Responsive Alert"
    className="@container @sm:p-4 @lg:p-6"
  >
    <div className="@sm:text-sm @lg:text-base @sm:space-y-2 @lg:space-y-4">
      <p>
        This alert adapts its padding and typography based on container size.
      </p>
      <div className="flex @sm:flex-col @lg:flex-row gap-2">
        <button className="@sm:w-full @lg:w-auto px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Action 1
        </button>
        <button className="@sm:w-full @lg:w-auto px-3 py-1 border border-gray-300 rounded text-sm">
          Action 2
        </button>
      </div>
    </div>
  </Alert>
</div>
```

### Enhanced Animations with Modern CSS

```tsx
// Alert with custom entrance animations
<Alert
  theme="success"
  title="Animated Alert"
  open={showAlert}
  onClose={() => setShowAlert(false)}
  className="animate-[slideInRight_0.5s_ease-out] hover:animate-[pulse_2s_ease-in-out_infinite]"
>
  <p>This alert has custom entrance and hover animations.</p>
</Alert>
```

```css
/* Custom animations for alerts */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Notification System with Stacking

```tsx
const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 @container">
      {notifications.map((notification, index) => (
        <Alert
          key={notification.id}
          theme={notification.type}
          title={notification.title}
          open={true}
          onClose={() => removeNotification(notification.id)}
          className="
            min-w-[300px] @sm:min-w-[350px] @lg:min-w-[400px]
            animate-[slideInRight_0.3s_ease-out] 
            hover:scale-105 transition-transform duration-200
            backdrop-blur-sm bg-white/95
          "
          style={{
            animationDelay: `${index * 0.1}s`,
            "--notification-index": index,
          }}
        >
          <div className="@sm:text-sm @lg:text-base">
            {notification.message}
          </div>
        </Alert>
      ))}
    </div>
  );
};
```

### Alert with Progress Indicator

```tsx
const ProgressAlert = ({ progress = 0 }) => {
  return (
    <Alert
      theme="info"
      title="Processing..."
      className="relative overflow-hidden"
    >
      {/* Progress bar using CSS custom properties */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
        style={{
          "--progress": `${progress}%`,
          width: "var(--progress)",
        }}
      />

      <div className="space-y-2">
        <p>Your request is being processed...</p>
        <div className="text-sm text-gray-600">Progress: {progress}%</div>
      </div>
    </Alert>
  );
};
```

## Notes

- Alerts remain rendered in the DOM when closed (with `aria-hidden`)
- The close button only appears when `onClose` is provided
- Default icons are automatically shown for certain themes
- The component supports polymorphic rendering with the `as` prop
- Animation can be disabled by controlling the `open` prop directly
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and modern animations
- Enhanced with responsive design capabilities and custom theming options
