# Input Component

A powerful text input component with advanced masking capabilities, validation support, and form integration. Built on top of `the-mask-input` library for comprehensive input formatting.

## Import

```tsx
import { Input } from "@g4rcez/components/input";
```

## Basic Usage

```tsx
<Input placeholder="Enter text..." />
```

## Props

The Input component extends all standard HTML input props and adds masking functionality:

| Prop        | Type                                                                   | Default | Description                           |
| ----------- | ---------------------------------------------------------------------- | ------- | ------------------------------------- |
| `mask`      | `AllMasks \| Array<string \| RegExp> \| ((value: string) => AllMasks)` | -       | Input mask pattern                    |
| `locale`    | `Locales`                                                              | -       | Locale for currency/number formatting |
| `currency`  | `CurrencyCode`                                                         | -       | Currency code for currency masks      |
| `error`     | `string`                                                               | -       | Error message to display              |
| `label`     | `string`                                                               | -       | Input label                           |
| `required`  | `boolean`                                                              | `false` | Required field indicator              |
| `disabled`  | `boolean`                                                              | `false` | Disabled state                        |
| `loading`   | `boolean`                                                              | `false` | Loading state                         |
| `className` | `string`                                                               | -       | Additional CSS classes                |
| `...props`  | `React.InputHTMLAttributes`                                            | -       | All standard input attributes         |

## Mask Types

### Currency Masks

```tsx
// US Dollar
<Input mask="currency" currency="USD" locale="en-US" />

// Euro
<Input mask="currency" currency="EUR" locale="de-DE" />

// Brazilian Real
<Input mask="currency" currency="BRL" locale="pt-BR" />
```

### Percentage Masks

```tsx
<Input mask="percentage" placeholder="Enter percentage" />
```

### Custom String Masks

```tsx
// Phone number
<Input mask="(99) 99999-9999" placeholder="Phone" />

// CPF (Brazilian tax ID)
<Input mask="999.999.999-99" placeholder="CPF" />

// Date
<Input mask="99/99/9999" placeholder="DD/MM/YYYY" />

// Credit card
<Input mask="9999 9999 9999 9999" placeholder="Card number" />
```

### RegExp Masks

```tsx
// Only letters
<Input mask={[/[a-zA-Z]/]} placeholder="Letters only" />

// Only numbers
<Input mask={[/\d/]} placeholder="Numbers only" />

// Mixed pattern
<Input mask={[/[A-Z]/, /\d/, /\d/, "-", /[A-Z]/, /\d/, /\d/]} placeholder="A99-A99" />
```

### Dynamic Masks

```tsx
const dynamicMask = (value: string) => {
  // Different mask based on input length
  if (value.length <= 11) {
    return "999.999.999-99"; // CPF
  }
  return "99.999.999/9999-99"; // CNPJ
};

<Input mask={dynamicMask} placeholder="CPF or CNPJ" />;
```

## Examples

### Basic Text Input

```tsx
<Input
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Phone Number Input

```tsx
<Input
  mask="(99) 99999-9999"
  placeholder="Phone number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
```

### Currency Input

```tsx
<Input
  mask="currency"
  currency="USD"
  locale="en-US"
  placeholder="Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>
```

### Date Input

```tsx
<Input
  mask="99/99/9999"
  placeholder="MM/DD/YYYY"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
```

### Credit Card Input

```tsx
<Input
  mask="9999 9999 9999 9999"
  placeholder="Card number"
  value={cardNumber}
  onChange={(e) => setCardNumber(e.target.value)}
/>
```

### Input with Validation

```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    setError("Please enter a valid email address");
  } else {
    setError("");
  }
};

<Input
  type="email"
  placeholder="Email address"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  }}
  error={error}
/>;
```

### Form Integration

```tsx
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zipCode: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <form className="space-y-4">
      <Input
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange("name")}
        required
      />

      <Input
        mask="(99) 99999-9999"
        placeholder="Phone number"
        value={formData.phone}
        onChange={handleChange("phone")}
      />

      <Input
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange("email")}
        required
      />

      <Input
        mask="99999-999"
        placeholder="ZIP code"
        value={formData.zipCode}
        onChange={handleChange("zipCode")}
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
};
```

### International Phone Numbers

```tsx
const PhoneInput = () => {
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");

  const masks = {
    US: "(999) 999-9999",
    BR: "(99) 99999-9999",
    UK: "9999 999 9999",
    FR: "99 99 99 99 99",
  };

  return (
    <div className="flex gap-2">
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="px-3 py-2 border rounded"
      >
        <option value="US">🇺🇸 US</option>
        <option value="BR">🇧🇷 BR</option>
        <option value="UK">🇬🇧 UK</option>
        <option value="FR">🇫🇷 FR</option>
      </select>

      <Input
        mask={masks[country]}
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};
```

### Multi-format Input

```tsx
const DocumentInput = () => {
  const [document, setDocument] = useState("");

  // Dynamic mask based on input length
  const getDocumentMask = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return "999.999.999-99"; // CPF format
    }
    return "99.999.999/9999-99"; // CNPJ format
  };

  return (
    <Input
      mask={getDocumentMask}
      placeholder="CPF or CNPJ"
      value={document}
      onChange={(e) => setDocument(e.target.value)}
    />
  );
};
```

### Password Input with Strength

```tsx
const PasswordInput = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["red", "orange", "yellow", "blue", "green"];

  return (
    <div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {password && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded ${
                  level <= strength
                    ? `bg-${strengthColors[strength - 1]}-500`
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p
            className={`text-sm mt-1 text-${strengthColors[strength - 1]}-600`}
          >
            {strengthLabels[strength - 1]}
          </p>
        </div>
      )}
    </div>
  );
};
```

## Mask Patterns

### Common Patterns

| Pattern | Description                     | Example       |
| ------- | ------------------------------- | ------------- |
| `9`     | Numeric digit (0-9)             | `999-99-9999` |
| `A`     | Alphabetic character (a-z, A-Z) | `AAA-999`     |
| `S`     | Alphanumeric character          | `SSS-999`     |
| `*`     | Any character                   | `***-***`     |

### Special Masks

| Mask           | Description                             |
| -------------- | --------------------------------------- |
| `"currency"`   | Currency formatting with locale support |
| `"percentage"` | Percentage input with % symbol          |
| `"decimal"`    | Decimal number formatting               |

## Accessibility

- Supports all ARIA attributes
- Proper label association
- Screen reader compatible
- Keyboard navigation support
- Focus management
- Error state announcements

## Form Integration

The Input component integrates seamlessly with form libraries:

```tsx
// With useForm hook
const form = useForm(schema, "myForm");

<Input {...form.input("fieldName")} placeholder="Enter value" />;
```

## Styling

The Input component uses the `createFreeText` factory and supports:

- Consistent styling with other form components
- Error states with visual feedback
- Loading states
- Disabled states
- Custom className override

## Best Practices

1. **Choose Appropriate Masks**: Use masks that match user expectations
2. **Provide Clear Placeholders**: Show the expected format
3. **Validate Input**: Combine with validation for better UX
4. **Handle Errors Gracefully**: Show clear error messages
5. **Consider Accessibility**: Ensure screen reader compatibility
6. **Test with Real Data**: Test masks with various input scenarios

## Tailwind CSS v4 Integration

The Input component leverages Tailwind CSS v4's advanced features for enhanced styling and responsiveness.

### Using CSS Variables and Custom Properties

```tsx
// Input with custom CSS variables
<Input
  placeholder="Custom styled input"
  className="bg-[--input-bg] border-[--input-border] text-[--input-text]"
  style={{
    "--input-bg": "rgb(from theme(colors.slate.50) r g b / 0.8)",
    "--input-border": "theme(colors.blue.300)",
    "--input-text": "theme(colors.slate.900)",
  }}
/>
```

### Container Queries for Responsive Forms

```tsx
// Form that adapts based on container size
<div className="@container max-w-md mx-auto">
  <div className="space-y-4">
    <Input
      placeholder="Name"
      className="@sm:text-lg @md:text-xl @sm:py-3 @md:py-4"
    />
    <Input
      mask="(99) 99999-9999"
      placeholder="Phone"
      className="@container-normal:text-base @container-wide:text-lg"
    />
  </div>
</div>
```

### Advanced Form Layouts with CSS Grid

```tsx
// Complex form layout using CSS Grid areas
<div className="grid [grid-template-areas:'name_name''email_phone''address_address'] @md:[grid-template-areas:'name_email''phone_address'] gap-4">
  <Input placeholder="Full Name" className="[grid-area:name]" />
  <Input type="email" placeholder="Email" className="[grid-area:email]" />
  <Input
    mask="(99) 99999-9999"
    placeholder="Phone"
    className="[grid-area:phone]"
  />
  <Input placeholder="Address" className="[grid-area:address]" />
</div>
```

### Dynamic Theming with Color Functions

```tsx
const ThemedInput = ({ theme = "blue" }) => {
  return (
    <Input
      placeholder="Themed input"
      className="border-[--theme-color] focus:ring-[--theme-color]/20 focus:border-[--theme-color-dark]"
      style={{
        "--theme-color": `theme(colors.${theme}.400)`,
        "--theme-color-dark": `color-mix(in srgb, theme(colors.${theme}.500) 80%, black)`,
      }}
    />
  );
};

// Usage with different themes
<div className="space-y-4">
  <ThemedInput theme="blue" />
  <ThemedInput theme="green" />
  <ThemedInput theme="purple" />
</div>;
```

### Enhanced Input States with Modern CSS

```tsx
// Input with advanced state styling
<Input
  placeholder="Advanced input"
  className="
    border-2 border-slate-200 
    focus:border-[color-mix(in_srgb,theme(colors.blue.500)_70%,transparent)]
    focus:ring-4 focus:ring-[color-mix(in_srgb,theme(colors.blue.500)_10%,transparent)]
    invalid:border-[color-mix(in_srgb,theme(colors.red.500)_70%,transparent)]
    invalid:ring-[color-mix(in_srgb,theme(colors.red.500)_10%,transparent)]
    transition-[border-color,box-shadow] duration-200
  "
/>
```

### Responsive Input Groups

```tsx
// Input group with responsive behavior
<div className="@container">
  <div className="flex @sm:flex-col @lg:flex-row gap-2">
    <div className="flex-1">
      <Input
        placeholder="First Name"
        className="@sm:w-full @lg:rounded-r-none"
      />
    </div>
    <div className="flex-1">
      <Input
        placeholder="Last Name"
        className="@sm:w-full @lg:rounded-l-none @lg:border-l-0"
      />
    </div>
  </div>
</div>
```

### Currency Input with Locale-Aware Styling

```tsx
const CurrencyInput = ({ locale = "en-US", currency = "USD" }) => {
  const isRTL = locale.includes("ar") || locale.includes("he");

  return (
    <div className="relative">
      <Input
        mask="currency"
        currency={currency}
        locale={locale}
        placeholder="0.00"
        className={`
          ${isRTL ? "text-right pr-12 pl-4" : "text-left pl-12 pr-4"}
          font-mono tabular-nums
          bg-gradient-to-r from-green-50 to-emerald-50
          border-green-200 focus:border-green-400
        `}
      />
      <div
        className={`
        absolute top-1/2 -translate-y-1/2 
        ${isRTL ? "right-3" : "left-3"}
        text-green-600 font-semibold
      `}
      >
        {currency === "USD" ? "$" : currency === "EUR" ? "€" : currency}
      </div>
    </div>
  );
};
```

### Form Validation with Modern Animations

```tsx
const ValidatedInput = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (val) => {
    if (val.length < 3) {
      setError("Too short");
    } else {
      setError("");
    }
  };

  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          validate(e.target.value);
        }}
        placeholder="Enter at least 3 characters"
        className={`
          transition-all duration-300 ease-in-out
          ${
            error
              ? "border-red-400 bg-red-50 animate-[shake_0.5s_ease-in-out]"
              : value.length >= 3
                ? "border-green-400 bg-green-50"
                : "border-gray-300"
          }
        `}
      />
      {error && (
        <p className="text-red-600 text-sm animate-[slideDown_0.3s_ease-out]">
          {error}
        </p>
      )}
    </div>
  );
};
```

```css
/* Custom animations for validation */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Multi-Step Form with Progress Styling

```tsx
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <div className="@container max-w-lg mx-auto">
      {/* Progress bar using CSS custom properties */}
      <div
        className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden"
        style={{ "--progress": `${(step / totalSteps) * 100}%` }}
      >
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 w-[--progress]" />
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <Input
            placeholder="Personal Information"
            className="@sm:text-lg border-blue-300 focus:border-blue-500"
          />
        )}
        {step === 2 && (
          <Input
            mask="(99) 99999-9999"
            placeholder="Contact Information"
            className="@sm:text-lg border-purple-300 focus:border-purple-500"
          />
        )}
        {step === 3 && (
          <Input
            type="email"
            placeholder="Account Information"
            className="@sm:text-lg border-green-300 focus:border-green-500"
          />
        )}
      </div>
    </div>
  );
};
```

## Notes

- Built on top of `the-mask-input` library
- Supports all mask features from the underlying library
- Automatically handles cursor positioning
- Preserves raw and formatted values
- Works with controlled and uncontrolled patterns
- Supports dynamic mask changes based on input value
- Fully compatible with Tailwind CSS v4's advanced features including CSS variables, container queries, and color functions
- Supports RTL languages and locale-aware styling
- Enhanced with modern CSS animations and transitions
