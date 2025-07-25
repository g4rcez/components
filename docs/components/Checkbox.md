# Checkbox Component

A styled checkbox component with label support, task mode, and form integration. Provides consistent styling and accessibility features.

## Import

```tsx
import { Checkbox } from "@g4rcez/components/checkbox";
```

## Basic Usage

```tsx
<Checkbox>Accept terms and conditions</Checkbox>
```

## Props

| Prop             | Type                                          | Default    | Description                                          |
| ---------------- | --------------------------------------------- | ---------- | ---------------------------------------------------- |
| `checked`        | `boolean`                                     | -          | Checkbox checked state                               |
| `onChange`       | `(e: ChangeEvent<HTMLInputElement>) => void`  | -          | Change handler                                       |
| `disabled`       | `boolean`                                     | `false`    | Disabled state                                       |
| `loading`        | `boolean`                                     | `false`    | Loading state (disables checkbox)                    |
| `error`          | `string`                                      | -          | Error message to display                             |
| `asTask`         | `boolean`                                     | `false`    | Renders as task item with strikethrough when checked |
| `size`           | `"medium" \| "large"`                         | `"medium"` | Checkbox size                                        |
| `container`      | `string`                                      | -          | Additional classes for container                     |
| `labelClassName` | `string`                                      | -          | Additional classes for error label                   |
| `className`      | `string`                                      | -          | Additional classes for checkbox input                |
| `children`       | `React.ReactNode`                             | -          | Label content                                        |
| `...props`       | `React.InputHTMLAttributes<HTMLInputElement>` | -          | All standard input attributes                        |

## Examples

### Basic Checkbox

```tsx
const [accepted, setAccepted] = useState(false);

<Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
  I accept the terms and conditions
</Checkbox>;
```

### Checkbox with Error

```tsx
const [agreed, setAgreed] = useState(false);
const [error, setError] = useState("");

const handleSubmit = () => {
  if (!agreed) {
    setError("You must accept the terms to continue");
  } else {
    setError("");
    // Proceed with submission
  }
};

<Checkbox
  checked={agreed}
  onChange={(e) => {
    setAgreed(e.target.checked);
    if (e.target.checked) setError("");
  }}
  error={error}
>
  I agree to the privacy policy
</Checkbox>;
```

### Task Checkbox

```tsx
const [tasks, setTasks] = useState([
  { id: 1, text: "Complete project proposal", done: false },
  { id: 2, text: "Review code changes", done: true },
  { id: 3, text: "Update documentation", done: false },
]);

const toggleTask = (id: number) => {
  setTasks((prev) =>
    prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
  );
};

<div className="space-y-2">
  {tasks.map((task) => (
    <Checkbox
      key={task.id}
      checked={task.done}
      onChange={() => toggleTask(task.id)}
      asTask
    >
      {task.text}
    </Checkbox>
  ))}
</div>;
```

### Disabled Checkbox

```tsx
<div className="space-y-2">
  <Checkbox disabled checked>
    This option is disabled and checked
  </Checkbox>

  <Checkbox disabled>This option is disabled and unchecked</Checkbox>
</div>
```

### Loading Checkbox

```tsx
const [loading, setLoading] = useState(false);
const [subscribed, setSubscribed] = useState(false);

const handleSubscribe = async (checked: boolean) => {
  setLoading(true);
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubscribed(checked);
  } finally {
    setLoading(false);
  }
};

<Checkbox
  checked={subscribed}
  onChange={(e) => handleSubscribe(e.target.checked)}
  loading={loading}
>
  Subscribe to newsletter
</Checkbox>;
```

### Checkbox Sizes

```tsx
<div className="space-y-4">
  <Checkbox size="medium">Medium checkbox (default)</Checkbox>

  <Checkbox size="large">Large checkbox</Checkbox>
</div>
```

### Form with Multiple Checkboxes

```tsx
const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    productUpdates: true,
  });

  const handlePreferenceChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: e.target.checked,
      }));
    };

  return (
    <form className="space-y-4">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>

      <div className="space-y-3">
        <Checkbox
          checked={preferences.emailNotifications}
          onChange={handlePreferenceChange("emailNotifications")}
        >
          Email notifications
        </Checkbox>

        <Checkbox
          checked={preferences.smsNotifications}
          onChange={handlePreferenceChange("smsNotifications")}
        >
          SMS notifications
        </Checkbox>

        <Checkbox
          checked={preferences.pushNotifications}
          onChange={handlePreferenceChange("pushNotifications")}
        >
          Push notifications
        </Checkbox>
      </div>

      <h4 className="text-md font-medium mt-6">Marketing</h4>

      <div className="space-y-3">
        <Checkbox
          checked={preferences.marketingEmails}
          onChange={handlePreferenceChange("marketingEmails")}
        >
          Marketing emails
        </Checkbox>

        <Checkbox
          checked={preferences.productUpdates}
          onChange={handlePreferenceChange("productUpdates")}
        >
          Product updates
        </Checkbox>
      </div>

      <button
        type="submit"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Preferences
      </button>
    </form>
  );
};
```

### Checkbox Group with Select All

```tsx
const CheckboxGroup = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", selected: false },
    { id: 2, name: "Item 2", selected: false },
    { id: 3, name: "Item 3", selected: true },
    { id: 4, name: "Item 4", selected: false },
  ]);

  const selectedCount = items.filter((item) => item.selected).length;
  const allSelected = selectedCount === items.length;
  const someSelected = selectedCount > 0 && selectedCount < items.length;

  const toggleAll = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  return (
    <div className="space-y-3">
      <div className="border-b pb-2">
        <Checkbox
          checked={allSelected}
          onChange={(e) => toggleAll(e.target.checked)}
          className={someSelected && !allSelected ? "indeterminate" : ""}
        >
          <strong>
            Select All ({selectedCount}/{items.length})
          </strong>
        </Checkbox>
      </div>

      <div className="space-y-2 pl-4">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            checked={item.selected}
            onChange={() => toggleItem(item.id)}
          >
            {item.name}
          </Checkbox>
        ))}
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p>{selectedCount} item(s) selected</p>
        </div>
      )}
    </div>
  );
};
```

### Validation Example

```tsx
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.agreeToTerms) newErrors.terms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <Checkbox
        checked={formData.agreeToTerms}
        onChange={(e) => {
          setFormData({ ...formData, agreeToTerms: e.target.checked });
          if (e.target.checked && errors.terms) {
            setErrors({ ...errors, terms: undefined });
          }
        }}
        error={errors.terms}
      >
        I agree to the{" "}
        <a href="/terms" className="text-blue-500">
          Terms of Service
        </a>
      </Checkbox>

      <Checkbox
        checked={formData.subscribeNewsletter}
        onChange={(e) =>
          setFormData({ ...formData, subscribeNewsletter: e.target.checked })
        }
      >
        Subscribe to our newsletter (optional)
      </Checkbox>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        Register
      </button>
    </form>
  );
};
```

### Custom Styled Checkbox

```tsx
<Checkbox
  className="text-green-500 focus:ring-green-500"
  container="p-3 border border-gray-200 rounded hover:bg-gray-50"
>
  <div>
    <div className="font-medium">Premium Feature</div>
    <div className="text-sm text-gray-500">
      Enable advanced analytics and reporting
    </div>
  </div>
</Checkbox>
```

## Task Mode

When `asTask={true}`, the checkbox behaves as a task item:

- Checked items get a strikethrough effect
- Useful for todo lists and task management
- Maintains all standard checkbox functionality

## Styling

The Checkbox component includes:

- **Consistent Design**: Matches form component styling
- **Focus States**: Visible focus rings for keyboard navigation
- **Disabled States**: Reduced opacity when disabled
- **Error States**: Red styling for error messages
- **Task Mode**: Strikethrough effect for completed tasks

## Accessibility

- **Semantic HTML**: Uses native `<input type="checkbox">`
- **Label Association**: Proper label-input relationship
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper announcements
- **Focus Management**: Visible focus indicators
- **ARIA Attributes**: Proper accessibility attributes

## Form Integration

Works seamlessly with form libraries:

```tsx
// With useForm hook
const form = useForm(schema, "myForm");

<Checkbox {...form.checkbox("fieldName")}>Checkbox label</Checkbox>;
```

## Data Attributes

- `data-component="checkbox"`: Identifies the component
- `data-task`: Indicates task mode
- `data-disabled`: Indicates disabled state

## Use Cases

### 1. **Terms and Conditions**

```tsx
<Checkbox required>I accept the terms and conditions</Checkbox>
```

### 2. **User Preferences**

```tsx
<Checkbox>Enable dark mode</Checkbox>
<Checkbox>Receive email notifications</Checkbox>
```

### 3. **Todo Lists**

```tsx
<Checkbox asTask>Complete project documentation</Checkbox>
<Checkbox asTask>Review pull requests</Checkbox>
```

### 4. **Multi-select Options**

```tsx
<Checkbox>Option A</Checkbox>
<Checkbox>Option B</Checkbox>
<Checkbox>Option C</Checkbox>
```

## Best Practices

1. **Clear Labels**: Use descriptive, actionable labels
2. **Logical Grouping**: Group related checkboxes together
3. **Validation**: Provide clear error messages
4. **Default States**: Consider appropriate default checked states
5. **Accessibility**: Ensure keyboard navigation works
6. **Visual Hierarchy**: Use consistent spacing and alignment

## Tailwind CSS v4 Integration

The Checkbox component leverages Tailwind CSS v4's modern features for enhanced styling and responsive behavior.

### Using CSS Variables for Dynamic Theming

```tsx
// Checkbox with custom theme using CSS variables
<Checkbox
  className="accent-[--checkbox-color] focus:ring-[--checkbox-ring]"
  style={{
    "--checkbox-color": "theme(colors.purple.500)",
    "--checkbox-ring":
      "color-mix(in srgb, theme(colors.purple.500) 20%, transparent)",
  }}
>
  Custom themed checkbox
</Checkbox>
```

### Container Queries for Responsive Forms

```tsx
// Checkbox group that adapts based on container size
<div className="@container max-w-lg mx-auto">
  <div className="@sm:space-y-2 @lg:space-y-4">
    <Checkbox className="@sm:text-sm @lg:text-base">
      <span className="@sm:text-sm @lg:text-base">
        Responsive checkbox text
      </span>
    </Checkbox>
    <Checkbox className="@sm:text-sm @lg:text-base">
      <span className="@sm:text-sm @lg:text-base">
        Another responsive option
      </span>
    </Checkbox>
  </div>
</div>
```

### Advanced Checkbox Layouts with CSS Grid

```tsx
// Checkbox grid with complex layout
<div className="@container">
  <div className="grid [grid-template-areas:'basic_basic''advanced_premium'] @lg:[grid-template-areas:'basic_advanced_premium'] gap-4">
    <div className="[grid-area:basic] p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Basic Features</h3>
      <div className="space-y-2">
        <Checkbox>Feature 1</Checkbox>
        <Checkbox>Feature 2</Checkbox>
      </div>
    </div>

    <div className="[grid-area:advanced] p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Advanced Features</h3>
      <div className="space-y-2">
        <Checkbox>Advanced Feature 1</Checkbox>
        <Checkbox>Advanced Feature 2</Checkbox>
      </div>
    </div>

    <div className="[grid-area:premium] p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
      <h3 className="font-semibold mb-3">Premium Features</h3>
      <div className="space-y-2">
        <Checkbox className="accent-purple-500">Premium Feature 1</Checkbox>
        <Checkbox className="accent-purple-500">Premium Feature 2</Checkbox>
      </div>
    </div>
  </div>
</div>
```

### Enhanced Task List with Modern Styling

```tsx
const ModernTaskList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project proposal", done: false, priority: "high" },
    { id: 2, text: "Review code changes", done: true, priority: "medium" },
    { id: 3, text: "Update documentation", done: false, priority: "low" },
  ]);

  const priorityColors = {
    high: "red",
    medium: "yellow",
    low: "green",
  };

  return (
    <div className="@container space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="
            group p-4 rounded-lg border transition-all duration-200
            hover:shadow-md hover:border-gray-300
            data-[completed=true]:bg-gray-50
          "
          data-completed={task.done}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              asTask
              className="mt-1 accent-[--priority-color] focus:ring-[--priority-color]/20"
              style={{
                "--priority-color": `theme(colors.${priorityColors[task.priority]}.500)`,
              }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`
                  text-sm font-medium
                  ${task.done ? "line-through text-gray-500" : ""}
                `}
                >
                  {task.text}
                </span>
                <span
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{
                    backgroundColor: `theme(colors.${priorityColors[task.priority]}.500)`,
                  }}
                >
                  {task.priority}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Created today</span>
                {task.done && <span>• Completed</span>}
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Animated Checkbox States

```tsx
// Checkbox with custom animations
<Checkbox
  className="
    transition-all duration-200 
    hover:scale-110 
    checked:animate-[checkBounce_0.3s_ease-out]
    focus:ring-4 focus:ring-blue-500/20
  "
>
  <span className="transition-colors duration-200 group-hover:text-blue-600">
    Animated checkbox
  </span>
</Checkbox>
```

```css
/* Custom animation for checkbox */
@keyframes checkBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
```

## Notes

- Uses native HTML checkbox input for best accessibility
- Supports all standard HTML input attributes
- Error messages appear below the checkbox
- Loading state automatically disables the checkbox
- Task mode adds visual strikethrough effect when checked
- The component forwards refs for external access
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and modern animations
- Enhanced with responsive design capabilities and custom theming options
- Supports complex layouts with CSS Grid areas and priority-based styling
