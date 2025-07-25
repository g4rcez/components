# Component API Documentation

This document provides detailed API documentation for all components in the @g4rcez/components library.

## Table of Contents

- [Core Components](#core-components)
- [Form Components](#form-components)
- [Display Components](#display-components)
- [Floating Components](#floating-components)
- [Table Components](#table-components)
- [Hooks](#hooks)
- [Utilities](#utilities)

## Core Components

### Button

A versatile button component with multiple variants and states.

```tsx
import { Button } from "@g4rcez/components/button";

<Button variant="primary" size="md" disabled={false}>
  Click me
</Button>;
```

**Props:**

- `variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"` - Button style variant
- `size?: "sm" | "md" | "lg"` - Button size
- `disabled?: boolean` - Disabled state
- `loading?: boolean` - Loading state with spinner
- `children: React.ReactNode` - Button content
- `onClick?: (event: MouseEvent) => void` - Click handler
- All standard HTML button attributes

**Usage Examples:**

```tsx
// Primary button
<Button variant="primary">Save</Button>

// Loading state
<Button loading>Saving...</Button>

// With icon
<Button variant="outline">
  <Icon name="plus" />
  Add Item
</Button>
```

### Tag

A label/badge component for displaying metadata or status.

```tsx
import { Tag } from "@g4rcez/components/tag";

<Tag variant="default" size="sm">
  New
</Tag>;
```

**Props:**

- `variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error"` - Tag color variant
- `size?: "sm" | "md" | "lg"` - Tag size
- `removable?: boolean` - Shows remove button
- `onRemove?: () => void` - Remove handler
- `children: React.ReactNode` - Tag content

### Polymorph

A polymorphic component that can render as different HTML elements.

```tsx
import { Polymorph } from "@g4rcez/components";

<Polymorph as="button" className="custom-class">
  Content
</Polymorph>;
```

**Props:**

- `as: keyof JSX.IntrinsicElements` - HTML element to render as
- All props of the specified element type

## Form Components

### Input

A text input component with mask support and validation.

```tsx
import { Input } from "@g4rcez/components/input";

<Input
  placeholder="Enter text..."
  mask="(99) 99999-9999"
  error="This field is required"
/>;
```

**Props:**

- `mask?: string` - Input mask pattern using [the-mask-input](https://www.npmjs.com/package/the-mask-input)
- `error?: string` - Error message to display
- `label?: string` - Input label
- `required?: boolean` - Required field indicator
- `disabled?: boolean` - Disabled state
- All standard HTML input attributes

**Mask Examples:**

```tsx
// Phone number
<Input mask="(99) 99999-9999" placeholder="Phone" />

// CPF
<Input mask="999.999.999-99" placeholder="CPF" />

// Date
<Input mask="99/99/9999" placeholder="DD/MM/YYYY" />
```

### Select

A native select component with custom styling.

```tsx
import { Select } from "@g4rcez/components/select";

<Select
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
  placeholder="Choose an option"
/>;
```

**Props:**

- `options: Array<{value: string, label: string}>` - Select options
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message
- `label?: string` - Select label
- `multiple?: boolean` - Multiple selection
- All standard HTML select attributes

### Autocomplete

A searchable select component with floating UI and fuzzy search.

```tsx
import { Autocomplete } from "@g4rcez/components/autocomplete";

<Autocomplete
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
  ]}
  placeholder="Search frameworks..."
  searchable
/>;
```

**Props:**

- `options: Array<{value: string, label: string}>` - Available options
- `searchable?: boolean` - Enable search functionality
- `multiple?: boolean` - Multiple selection
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message
- `onSearch?: (query: string) => void` - Search handler
- `loading?: boolean` - Loading state

**Features:**

- Fuzzy search with highlighting
- Keyboard navigation
- Virtual scrolling for large lists
- Custom option rendering

### Checkbox

A checkbox input component with custom styling.

```tsx
import { Checkbox } from "@g4rcez/components/checkbox";

<Checkbox
  checked={true}
  onChange={(checked) => console.log(checked)}
  label="Accept terms"
/>;
```

**Props:**

- `checked?: boolean` - Checked state
- `indeterminate?: boolean` - Indeterminate state
- `label?: string` - Checkbox label
- `error?: string` - Error message
- `disabled?: boolean` - Disabled state
- `onChange?: (checked: boolean) => void` - Change handler

### Switch

A toggle switch component.

```tsx
import { Switch } from "@g4rcez/components/switch";

<Switch checked={enabled} onChange={setEnabled} label="Enable notifications" />;
```

**Props:**

- `checked?: boolean` - Switch state
- `label?: string` - Switch label
- `disabled?: boolean` - Disabled state
- `onChange?: (checked: boolean) => void` - Change handler

### DatePicker

A date picker component with calendar popup.

```tsx
import { DatePicker } from "@g4rcez/components/date-picker";

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Select date"
  format="dd/MM/yyyy"
/>;
```

**Props:**

- `value?: Date` - Selected date
- `onChange?: (date: Date | null) => void` - Date change handler
- `format?: string` - Date format string
- `placeholder?: string` - Placeholder text
- `minDate?: Date` - Minimum selectable date
- `maxDate?: Date` - Maximum selectable date
- `disabled?: boolean` - Disabled state

### FileUpload

A file upload component with drag & drop support.

```tsx
import { FileUpload } from "@g4rcez/components/file-upload";

<FileUpload
  accept="image/*"
  multiple
  onFilesChange={(files) => console.log(files)}
  maxSize={5 * 1024 * 1024} // 5MB
/>;
```

**Props:**

- `accept?: string` - Accepted file types
- `multiple?: boolean` - Multiple file selection
- `maxSize?: number` - Maximum file size in bytes
- `onFilesChange?: (files: File[]) => void` - File change handler
- `disabled?: boolean` - Disabled state

### Form

A form wrapper component with validation support.

```tsx
import { Form, useForm } from "@g4rcez/components/form";

const MyForm = () => {
  const form = useForm({
    initialValues: { name: "", email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required";
      return errors;
    },
  });

  return (
    <Form form={form} onSubmit={(values) => console.log(values)}>
      <Input name="name" label="Name" />
      <Input name="email" label="Email" type="email" />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
```

## Display Components

### Alert

An alert component for displaying messages.

```tsx
import { Alert } from "@g4rcez/components/alert";

<Alert variant="success" title="Success!" dismissible>
  Your changes have been saved.
</Alert>;
```

**Props:**

- `variant?: "info" | "success" | "warning" | "error"` - Alert type
- `title?: string` - Alert title
- `dismissible?: boolean` - Show dismiss button
- `onDismiss?: () => void` - Dismiss handler
- `children: React.ReactNode` - Alert content

### Card

A content container component.

```tsx
import { Card } from "@g4rcez/components/card";

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>Card content goes here.</Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>;
```

**Subcomponents:**

- `Card.Header` - Card header section
- `Card.Title` - Card title
- `Card.Content` - Main content area
- `Card.Footer` - Footer section

### Calendar

A calendar display component.

```tsx
import { Calendar } from "@g4rcez/components/calendar";

<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
  events={[{ date: new Date(), title: "Meeting" }]}
/>;
```

**Props:**

- `value?: Date` - Selected date
- `onChange?: (date: Date) => void` - Date selection handler
- `events?: Array<{date: Date, title: string}>` - Calendar events
- `minDate?: Date` - Minimum date
- `maxDate?: Date` - Maximum date

### Timeline

A timeline/stepper component.

```tsx
import { Timeline } from "@g4rcez/components/timeline";

<Timeline
  items={[
    { title: "Step 1", description: "Complete", status: "completed" },
    { title: "Step 2", description: "In progress", status: "active" },
    { title: "Step 3", description: "Pending", status: "pending" },
  ]}
/>;
```

**Props:**

- `items: Array<{title: string, description?: string, status: "completed" | "active" | "pending"}>` - Timeline items
- `orientation?: "vertical" | "horizontal"` - Timeline orientation

### Tabs

A tab navigation component.

```tsx
import { Tabs } from "@g4rcez/components/tabs";

<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content for tab 1</Tabs.Content>
  <Tabs.Content value="tab2">Content for tab 2</Tabs.Content>
</Tabs>;
```

## Floating Components

### Modal

A modal dialog component.

```tsx
import { Modal } from "@g4rcez/components/modal";

<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Content>Modal content goes here.</Modal.Content>
  <Modal.Footer>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </Modal.Footer>
</Modal>;
```

**Props:**

- `open: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `size?: "sm" | "md" | "lg" | "xl"` - Modal size
- `closeOnOverlayClick?: boolean` - Close on backdrop click
- `closeOnEscape?: boolean` - Close on escape key

### Tooltip

A tooltip component for hover information.

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>;
```

**Props:**

- `content: React.ReactNode` - Tooltip content
- `placement?: "top" | "bottom" | "left" | "right"` - Tooltip position
- `delay?: number` - Show delay in milliseconds
- `children: React.ReactNode` - Trigger element

### Dropdown

A dropdown menu component.

```tsx
import { Dropdown } from "@g4rcez/components/dropdown";

<Dropdown>
  <Dropdown.Trigger>
    <Button>Open Menu</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item onClick={() => console.log("Edit")}>Edit</Dropdown.Item>
    <Dropdown.Item onClick={() => console.log("Delete")}>Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>;
```

## Table Components

### Table

An advanced data table with sorting, filtering, and pagination.

```tsx
import { Table, createColumns } from "@g4rcez/components/table";

const columns = createColumns([
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", filterable: true },
]);

<Table
  data={users}
  columns={columns}
  pagination={{ pageSize: 10 }}
  searchable
/>;
```

**Features:**

- Column sorting
- Row filtering
- Global search
- Pagination
- Row selection
- Virtual scrolling
- Custom cell renderers

## Hooks

### useForm

Form state management hook.

```tsx
import { useForm } from "@g4rcez/components";

const form = useForm({
  initialValues: { name: "", email: "" },
  validate: (values) => {
    // Return validation errors
  },
});
```

### useTranslations

Internationalization hook.

```tsx
import { useTranslations } from "@g4rcez/components";

const t = useTranslations();
const message = t("common.save");
```

### useColorParser

Color parsing and manipulation hook.

```tsx
import { useColorParser } from "@g4rcez/components";

const { parseColor, lighten, darken } = useColorParser();
```

## Utilities

### Design Tokens

Access design system tokens:

```tsx
import { designTokens } from "@g4rcez/components/styles";

const primaryColor = designTokens.colors.primary;
```

### Theme System

Customize the component theme:

```tsx
import { ComponentsProvider } from "@g4rcez/components";

const customTheme = {
  colors: {
    primary: "#your-color",
  },
};

<ComponentsProvider theme={customTheme}>
  <App />
</ComponentsProvider>;
```
