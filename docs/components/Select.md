# Select Component

A styled native select component with enhanced functionality, built on the InputField foundation. Provides consistent styling, validation support, and form integration.

## Import

```tsx
import { Select } from "@g4rcez/components/select";
```

## Basic Usage

```tsx
<Select
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  placeholder="Choose an option"
/>
```

## Props

| Prop                 | Type                                          | Default | Description                             |
| -------------------- | --------------------------------------------- | ------- | --------------------------------------- |
| `options`            | `OptionProps[]`                               | -       | Array of select options                 |
| `selectContainer`    | `string`                                      | `""`    | Additional classes for select container |
| `required`           | `boolean`                                     | `true`  | Whether the field is required           |
| `error`              | `string`                                      | -       | Error message to display                |
| `loading`            | `boolean`                                     | `false` | Loading state                           |
| `disabled`           | `boolean`                                     | `false` | Disabled state                          |
| `placeholder`        | `string`                                      | -       | Placeholder text                        |
| `value`              | `string`                                      | -       | Selected value                          |
| `onChange`           | `(e: ChangeEvent<HTMLSelectElement>) => void` | -       | Change handler                          |
| `...inputFieldProps` | `InputFieldProps`                             | -       | All InputField props                    |

## Option Props

| Prop           | Type      | Description                                                |
| -------------- | --------- | ---------------------------------------------------------- |
| `value`        | `string`  | Option value                                               |
| `label`        | `string`  | Option display text (optional, uses value if not provided) |
| `disabled`     | `boolean` | Whether option is disabled                                 |
| `data-dynamic` | `string`  | Dynamic data attribute                                     |
| `data-*`       | `string`  | Custom data attributes                                     |

## Examples

### Basic Select

```tsx
const [selectedValue, setSelectedValue] = useState("");

<Select
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ]}
  placeholder="Select a fruit"
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
/>;
```

### Select with Validation

```tsx
const [country, setCountry] = useState("");
const [error, setError] = useState("");

const validateCountry = (value: string) => {
  if (!value) {
    setError("Please select a country");
  } else {
    setError("");
  }
};

<Select
  options={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
  ]}
  placeholder="Select country"
  value={country}
  onChange={(e) => {
    setCountry(e.target.value);
    validateCountry(e.target.value);
  }}
  error={error}
  required
/>;
```

### Select with Disabled Options

```tsx
<Select
  options={[
    { value: "available1", label: "Available Option 1" },
    { value: "available2", label: "Available Option 2" },
    { value: "disabled1", label: "Disabled Option", disabled: true },
    { value: "available3", label: "Available Option 3" },
  ]}
  placeholder="Select an option"
/>
```

### Select with Custom Data Attributes

```tsx
<Select
  options={[
    {
      value: "premium",
      label: "Premium Plan",
      "data-price": "29.99",
      "data-features": "unlimited",
    },
    {
      value: "basic",
      label: "Basic Plan",
      "data-price": "9.99",
      "data-features": "limited",
    },
  ]}
  placeholder="Choose a plan"
  onChange={(e) => {
    const option = e.target.selectedOptions[0];
    console.log("Price:", option.dataset.price);
    console.log("Features:", option.dataset.features);
  }}
/>
```

### Form Integration

```tsx
const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    status: "active",
  });

  const handleSelectChange =
    (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <Select
        options={[
          { value: "admin", label: "Administrator" },
          { value: "manager", label: "Manager" },
          { value: "employee", label: "Employee" },
          { value: "contractor", label: "Contractor" },
        ]}
        placeholder="Select role"
        value={formData.role}
        onChange={handleSelectChange("role")}
      />

      <Select
        options={[
          { value: "engineering", label: "Engineering" },
          { value: "marketing", label: "Marketing" },
          { value: "sales", label: "Sales" },
          { value: "hr", label: "Human Resources" },
        ]}
        placeholder="Select department"
        value={formData.department}
        onChange={handleSelectChange("department")}
      />

      <Select
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "pending", label: "Pending" },
        ]}
        value={formData.status}
        onChange={handleSelectChange("status")}
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        Create User
      </button>
    </form>
  );
};
```

### Dynamic Options

```tsx
const CategorySelect = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
  ];

  const subcategories = {
    electronics: [
      { value: "phones", label: "Phones" },
      { value: "laptops", label: "Laptops" },
      { value: "tablets", label: "Tablets" },
    ],
    clothing: [
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
      { value: "shoes", label: "Shoes" },
    ],
    books: [
      { value: "fiction", label: "Fiction" },
      { value: "non-fiction", label: "Non-Fiction" },
      { value: "textbooks", label: "Textbooks" },
    ],
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setSubcategory(""); // Reset subcategory when category changes
  };

  return (
    <div className="space-y-4">
      <Select
        options={categories}
        placeholder="Select category"
        value={category}
        onChange={handleCategoryChange}
      />

      {category && (
        <Select
          options={subcategories[category] || []}
          placeholder="Select subcategory"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        />
      )}
    </div>
  );
};
```

### Select with Loading State

```tsx
const AsyncSelect = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const loadOptions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOptions([
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <Select
      options={options}
      placeholder={loading ? "Loading options..." : "Select an option"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      loading={loading}
      disabled={loading}
    />
  );
};
```

### Multi-step Form with Select

```tsx
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
  });

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
  ];

  const states = {
    us: [
      { value: "ca", label: "California" },
      { value: "ny", label: "New York" },
      { value: "tx", label: "Texas" },
    ],
    ca: [
      { value: "on", label: "Ontario" },
      { value: "bc", label: "British Columbia" },
      { value: "qc", label: "Quebec" },
    ],
  };

  const cities = {
    ca: [
      { value: "la", label: "Los Angeles" },
      { value: "sf", label: "San Francisco" },
    ],
    ny: [
      { value: "nyc", label: "New York City" },
      { value: "buffalo", label: "Buffalo" },
    ],
    // ... more cities
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      country: e.target.value,
      state: "",
      city: "",
    });
    setStep(2);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      state: e.target.value,
      city: "",
    }));
    setStep(3);
  };

  return (
    <div className="space-y-4">
      <Select
        options={countries}
        placeholder="Select country"
        value={formData.country}
        onChange={handleCountryChange}
      />

      {step >= 2 && formData.country && (
        <Select
          options={states[formData.country] || []}
          placeholder="Select state/province"
          value={formData.state}
          onChange={handleStateChange}
        />
      )}

      {step >= 3 && formData.state && (
        <Select
          options={cities[formData.state] || []}
          placeholder="Select city"
          value={formData.city}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, city: e.target.value }))
          }
        />
      )}
    </div>
  );
};
```

## Styling

The Select component includes:

- **Consistent Styling**: Matches other form components
- **Custom Dropdown Icon**: ChevronDown icon with hover effects
- **Focus States**: Visual feedback for keyboard navigation
- **Error States**: Red styling when error prop is provided
- **Disabled States**: Reduced opacity and disabled cursor

## Accessibility

- **Semantic HTML**: Uses native `<select>` element
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper labeling and announcements
- **Focus Management**: Visible focus indicators
- **ARIA Attributes**: Proper accessibility attributes

## Form Integration

Works seamlessly with form libraries:

```tsx
// With useForm hook
const form = useForm(schema, "myForm");

<Select
  {...form.select("fieldName")}
  options={options}
  placeholder="Select option"
/>;
```

## Data Attributes

- `data-component="select"`: Identifies the component
- `data-selected`: Indicates if an option is selected

## Use Cases

### 1. **User Preferences**

```tsx
<Select
  options={[
    { value: "light", label: "Light Theme" },
    { value: "dark", label: "Dark Theme" },
    { value: "auto", label: "Auto" },
  ]}
  placeholder="Select theme"
/>
```

### 2. **Status Selection**

```tsx
<Select
  options={[
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ]}
  placeholder="Select status"
/>
```

### 3. **Priority Levels**

```tsx
<Select
  options={[
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ]}
  placeholder="Select priority"
/>
```

## Best Practices

1. **Clear Labels**: Use descriptive option labels
2. **Logical Ordering**: Order options logically (alphabetical, by importance, etc.)
3. **Appropriate Defaults**: Consider default selections when appropriate
4. **Validation**: Provide clear error messages
5. **Loading States**: Show loading indicators for async options
6. **Accessibility**: Ensure keyboard navigation works properly

## Tailwind CSS v4 Integration

The Select component leverages Tailwind CSS v4's modern features for enhanced styling and responsive behavior.

### Using CSS Variables for Dynamic Theming

```tsx
// Select with custom theme using CSS variables
<Select
  options={options}
  placeholder="Custom themed select"
  className="bg-[--select-bg] border-[--select-border] text-[--select-text]"
  style={{
    "--select-bg": "color-mix(in srgb, theme(colors.blue.50) 90%, white)",
    "--select-border": "theme(colors.blue.300)",
    "--select-text": "theme(colors.blue.900)",
  }}
/>
```

### Container Queries for Responsive Forms

```tsx
// Select that adapts based on container size
<div className="@container max-w-md mx-auto">
  <Select
    options={options}
    placeholder="Responsive select"
    className="@sm:text-base @lg:text-lg @sm:py-2 @lg:py-3"
    selectContainer="@sm:min-h-[40px] @lg:min-h-[48px]"
  />
</div>
```

### Advanced Form Layouts with CSS Grid

```tsx
// Form with complex layout using CSS Grid areas
<div className="@container">
  <form className="grid [grid-template-areas:'name_email''country_state''city_zip'] @lg:[grid-template-areas:'name_name_email_email''country_state_city_zip'] gap-4">
    <input placeholder="Name" className="[grid-area:name] p-2 border rounded" />
    <input
      placeholder="Email"
      className="[grid-area:email] p-2 border rounded"
    />
    <Select
      options={countryOptions}
      placeholder="Country"
      className="[grid-area:country]"
    />
    <Select
      options={stateOptions}
      placeholder="State"
      className="[grid-area:state]"
    />
    <input placeholder="City" className="[grid-area:city] p-2 border rounded" />
    <input placeholder="ZIP" className="[grid-area:zip] p-2 border rounded" />
  </form>
</div>
```

### Dynamic Select Styling with Color Functions

```tsx
const ThemedSelect = ({ theme = "blue", options, ...props }) => {
  return (
    <Select
      options={options}
      className="border-[--theme-color] focus:ring-[--theme-color]/20 focus:border-[--theme-color-dark]"
      style={{
        "--theme-color": `theme(colors.${theme}.400)`,
        "--theme-color-dark": `color-mix(in srgb, theme(colors.${theme}.500) 80%, black)`,
      }}
      {...props}
    />
  );
};

// Usage with different themes
<div className="space-y-4">
  <ThemedSelect theme="blue" options={options} placeholder="Blue theme" />
  <ThemedSelect theme="green" options={options} placeholder="Green theme" />
  <ThemedSelect theme="purple" options={options} placeholder="Purple theme" />
</div>;
```

### Enhanced Select States with Modern CSS

```tsx
// Select with advanced state styling
<Select
  options={options}
  placeholder="Advanced select"
  className="
    border-2 border-slate-200 
    focus:border-[color-mix(in_srgb,theme(colors.blue.500)_70%,transparent)]
    focus:ring-4 focus:ring-[color-mix(in_srgb,theme(colors.blue.500)_10%,transparent)]
    invalid:border-[color-mix(in_srgb,theme(colors.red.500)_70%,transparent)]
    invalid:ring-[color-mix(in_srgb,theme(colors.red.500)_10%,transparent)]
    transition-[border-color,box-shadow] duration-200
    hover:border-slate-300
  "
/>
```

## Notes

- Built on the InputField component for consistency
- Uses native `<select>` element for best accessibility
- Automatically handles focus and blur states
- Supports all standard HTML select attributes
- The placeholder appears as a disabled, hidden option
- Custom dropdown icon provides visual consistency
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and color functions
- Enhanced with responsive design capabilities and modern styling options
