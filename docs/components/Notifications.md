# Notifications Component

A comprehensive toast notification system with themes, stacking, animations, and programmatic control. Built on Radix UI Toast primitive with enhanced styling and functionality.

## Import

```tsx
import { NotificationProvider, useNotification } from "@g4rcez/components/notifications";
```

## Setup

Wrap your app with the NotificationProvider:

```tsx
import { NotificationProvider } from "@g4rcez/components/notifications";

function App() {
  return (
    <NotificationProvider max={5} duration={5000}>
      <YourApp />
    </NotificationProvider>
  );
}
```

## Basic Usage

```tsx
import { useNotification } from "@g4rcez/components/notifications";

function MyComponent() {
  const notify = useNotification();

  const handleClick = () => {
    notify("Operation completed successfully!", {
      theme: "success",
      title: "Success"
    });
  };

  return (
    <button onClick={handleClick}>
      Show Notification
    </button>
  );
}
```

## Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | `5` | Maximum number of notifications to display |
| `duration` | `number` | `5000` | Default duration in milliseconds |

## useNotification Hook

The hook returns a function to create notifications:

```tsx
const notify = useNotification();
const subscription = notify(message, options);
```

### Notification Function Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `Label` | ✅ | The notification message content |
| `options` | `NotificationOptions` | - | Optional configuration |

### Notification Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `Label` | - | Optional notification title |
| `theme` | `NotificationTheme` | `"default"` | Visual theme variant |
| `duration` | `number` | Provider default | Custom duration in ms |
| `closable` | `boolean` | `true` | Show close button |

### Theme Variants

- `"default"` - Neutral gray theme
- `"info"` - Blue information theme
- `"success"` - Green success theme
- `"warn"` - Yellow warning theme
- `"danger"` - Red error theme
- `"secondary"` - Secondary brand theme
- `"muted"` - Subtle muted theme

### Return Value (NotificationSubscriber)

```tsx
type NotificationSubscriber = {
  close: () => void;  // Close this specific notification
  clear: () => void;  // Clear all notifications
}
```

## Examples

### Basic Notifications

```tsx
function NotificationExamples() {
  const notify = useNotification();

  return (
    <div className="space-y-2">
      <button onClick={() => notify("Default notification")}>
        Default
      </button>
      
      <button onClick={() => notify("Information message", { theme: "info" })}>
        Info
      </button>
      
      <button onClick={() => notify("Success message", { theme: "success" })}>
        Success
      </button>
      
      <button onClick={() => notify("Warning message", { theme: "warn" })}>
        Warning
      </button>
      
      <button onClick={() => notify("Error message", { theme: "danger" })}>
        Error
      </button>
    </div>
  );
}
```

### Notifications with Titles

```tsx
function TitledNotifications() {
  const notify = useNotification();

  const showNotification = () => {
    notify("Your changes have been saved to the server.", {
      title: "Changes Saved",
      theme: "success",
      duration: 3000
    });
  };

  return <button onClick={showNotification}>Save Changes</button>;
}
```

### Manual Control

```tsx
function ManualControlExample() {
  const notify = useNotification();

  const showPersistentNotification = () => {
    const subscription = notify("This notification won't auto-dismiss", {
      title: "Manual Control",
      theme: "info",
      duration: Infinity, // Won't auto-close
      closable: true
    });

    // Manually close after 10 seconds
    setTimeout(() => {
      subscription.close();
    }, 10000);
  };

  const clearAllNotifications = () => {
    const subscription = notify("Clearing all notifications in 2 seconds...", {
      theme: "warn"
    });
    
    setTimeout(() => {
      subscription.clear(); // Clears all notifications
    }, 2000);
  };

  return (
    <div className="space-y-2">
      <button onClick={showPersistentNotification}>
        Show Persistent
      </button>
      <button onClick={clearAllNotifications}>
        Clear All (in 2s)
      </button>
    </div>
  );
}
```

### Form Submission Feedback

```tsx
function FormWithNotifications() {
  const notify = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve(void 0) : reject(new Error("Network error"));
        }, 2000);
      });

      notify("Form submitted successfully!", {
        title: "Success",
        theme: "success"
      });
    } catch (error) {
      notify("Failed to submit form. Please try again.", {
        title: "Submission Failed",
        theme: "danger",
        duration: 7000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Enter some data..." 
        className="block w-full px-3 py-2 border rounded"
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

### Progress Notifications

```tsx
function ProgressNotificationExample() {
  const notify = useNotification();

  const startProcess = async () => {
    const progressNotification = notify("Starting process...", {
      title: "Upload Progress",
      theme: "info",
      duration: Infinity,
      closable: false
    });

    // Simulate progress updates
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      progressNotification.close(); // Close previous
      
      if (i < 5) {
        progressNotification = notify(`Step ${i}/5 completed`, {
          title: "Upload Progress",
          theme: "info",
          duration: Infinity,
          closable: false
        });
      }
    }

    // Final success notification
    notify("Process completed successfully!", {
      title: "Upload Complete",
      theme: "success",
      duration: 4000
    });
  };

  return (
    <button onClick={startProcess} className="px-4 py-2 bg-green-500 text-white rounded">
      Start Process
    </button>
  );
}
```

### Contextual Notifications

```tsx
function ContextualNotifications() {
  const notify = useNotification();

  const notifications = {
    user: {
      login: () => notify("Welcome back!", { 
        title: "Login Successful", 
        theme: "success" 
      }),
      logout: () => notify("You have been logged out", { 
        title: "Goodbye", 
        theme: "info" 
      }),
      profileUpdate: () => notify("Profile updated successfully", { 
        title: "Profile Saved", 
        theme: "success" 
      })
    },
    
    data: {
      sync: () => notify("Data synchronized", { 
        theme: "success" 
      }),
      conflict: () => notify("Data conflict detected. Manual resolution required.", { 
        title: "Sync Conflict", 
        theme: "warn",
        duration: 10000 
      }),
      offline: () => notify("Working offline. Changes will sync when connected.", { 
        title: "Offline Mode", 
        theme: "muted",
        duration: 8000 
      })
    },
    
    system: {
      maintenance: () => notify("System maintenance scheduled for tonight at 2 AM", { 
        title: "Maintenance Notice", 
        theme: "warn",
        duration: 15000 
      }),
      error: () => notify("An unexpected error occurred. Please refresh the page.", { 
        title: "System Error", 
        theme: "danger",
        duration: 0 // Persistent until manually closed
      })
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">User Actions</h3>
        <button onClick={notifications.user.login}>Login</button>
        <button onClick={notifications.user.logout}>Logout</button>
        <button onClick={notifications.user.profileUpdate}>Update Profile</button>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Data Operations</h3>
        <button onClick={notifications.data.sync}>Sync Data</button>
        <button onClick={notifications.data.conflict}>Sync Conflict</button>
        <button onClick={notifications.data.offline}>Go Offline</button>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">System Events</h3>
        <button onClick={notifications.system.maintenance}>Maintenance</button>
        <button onClick={notifications.system.error}>System Error</button>
      </div>
    </div>
  );
}
```

## Advanced Configuration

### Custom Provider Settings

```tsx
<NotificationProvider 
  max={3}           // Show only 3 notifications at once
  duration={3000}   // 3 second default duration
>
  <App />
</NotificationProvider>
```

### Integration with Error Boundaries

```tsx
function ErrorBoundaryWithNotifications({ children }: { children: React.ReactNode }) {
  const notify = useNotification();

  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        notify("An unexpected error occurred. Please refresh the page.", {
          title: "Application Error",
          theme: "danger",
          duration: Infinity
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## Styling

The notification system includes built-in animations and stacking behavior:

- **Stacking**: Up to 4 notifications visible with hover effects
- **Animations**: Smooth enter/exit animations with Framer Motion
- **Responsive**: Adapts to mobile screens
- **Positioning**: Fixed positioning with proper z-index management

## Accessibility

- **Screen Reader Support**: Proper ARIA live regions
- **Keyboard Navigation**: Focusable close buttons
- **High Contrast**: Sufficient color contrast in all themes
- **Focus Management**: Appropriate focus handling

## Best Practices

1. **Use appropriate themes** for different message types
2. **Include titles** for important notifications
3. **Set longer durations** for complex messages
4. **Use persistent notifications** for critical errors
5. **Provide manual control** for processes that need user attention
6. **Clear all notifications** when navigating between major sections

## Related Components

- **Alert**: For persistent page-level messages
- **Modal**: For blocking user interactions
- **Progress**: For detailed progress indicators