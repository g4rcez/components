# Component Documentation Index

This document provides an index of all components exported from `@g4rcez/components` with links to their detailed documentation.

## 📋 Component Categories

### 🔧 Core Components

Foundation components that provide basic functionality and polymorphic capabilities.

| Component        | Description                                                         | Documentation                                   |
| ---------------- | ------------------------------------------------------------------- | ----------------------------------------------- |
| **Button**       | Versatile button with multiple variants and polymorphic rendering   | [Button.md](./components/Button.md)             |
| **Polymorph**    | Base polymorphic component for rendering as different HTML elements | [Polymorph.md](./components/Polymorph.md)       |
| **RenderOnView** | Performance optimization component with intersection observer       | [RenderOnView.md](./components/RenderOnView.md) |
| **Tag**          | Label/badge component for metadata and status display               | [Tag.md](./components/Tag.md)                   |

### 🎨 Display Components

Components for presenting information and organizing content.

| Component         | Description                                                | Documentation                     |
| ----------------- | ---------------------------------------------------------- | --------------------------------- |
| **Alert**         | Notification and message display with animations           | [Alert.md](./components/Alert.md) |
| **Calendar**      | Calendar display and date selection                        | [Calendar.md](./components/Calendar.md) |
| **Card**          | Container component with header, body, and footer sections | [Card.md](./components/Card.md)   |
| **Empty**         | Empty state placeholder component                          | [Empty.md](./components/Empty.md) |
| **List**          | List display component with virtualization support         | _Documentation pending_           |
| **Notifications** | Toast notification system                                  | [Notifications.md](./components/Notifications.md) |
| **Progress**      | Progress indicators and loading states                     | [Progress.md](./components/Progress.md) |
| **Shortcut**      | Keyboard shortcut display component                        | _Documentation pending_           |
| **Skeleton**      | Loading skeleton placeholders                              | [Skeleton.md](./components/Skeleton.md) |
| **Stats**         | Statistics and metrics display                             | _Documentation pending_           |
| **Step**          | Step indicator for multi-step processes                    | _Documentation pending_           |
| **Tabs**          | Tab navigation with keyboard support                       | [Tabs.md](./components/Tabs.md)   |
| **Timeline**      | Timeline and stepper component                             | _Documentation pending_           |

### 🎈 Floating Components

Overlay components using Floating UI for positioning.

| Component          | Description                              | Documentation                     |
| ------------------ | ---------------------------------------- | --------------------------------- |
| **CommandPalette** | Command palette with search and actions  | [CommandPalette.md](./components/CommandPalette.md) |
| **Dropdown**       | Dropdown menu component                  | [Dropdown.md](./components/Dropdown.md) |
| **Expand**         | Expandable content container             | _Documentation pending_           |
| **Menu**           | Context menu component                   | _Documentation pending_           |
| **Modal**          | Modal dialog with multiple display types | [Modal.md](./components/Modal.md) |
| **Toolbar**        | Floating toolbar component               | _Documentation pending_           |
| **Tooltip**        | Hover tooltip component                  | [Tooltip.md](./components/Tooltip.md) |

### 📝 Form Components

Input and form-related components with validation support.

| Component        | Description                            | Documentation                           |
| ---------------- | -------------------------------------- | --------------------------------------- |
| **Autocomplete** | Searchable select with fuzzy search    | [Autocomplete.md](./components/Autocomplete.md) |
| **Checkbox**     | Styled checkbox with task mode support | [Checkbox.md](./components/Checkbox.md) |
| **DatePicker**   | Date selection with calendar popup     | _Documentation pending_                 |
| **FileUpload**   | File upload with drag & drop           | [FileUpload.md](./components/FileUpload.md) |
| **Form**         | Form wrapper with validation           | _Documentation pending_                 |
| **Input**        | Text input with advanced masking       | [Input.md](./components/Input.md)       |
| **InputField**   | Base input field component             | _Documentation pending_                 |
| **MultiSelect**  | Multiple selection component           | _Documentation pending_                 |
| **Radiobox**     | Radio button component                 | _Documentation pending_                 |
| **Select**       | Native select with enhanced styling    | [Select.md](./components/Select.md)     |
| **Slider**       | Range slider component                 | _Documentation pending_                 |
| **Switch**       | Toggle switch component                | _Documentation pending_                 |
| **TaskList**     | Task management component              | _Documentation pending_                 |
| **Textarea**     | Multi-line text input                  | _Documentation pending_                 |
| **TransferList** | Dual-list selection component          | _Documentation pending_                 |

### 📊 Table Components

Data table components with advanced features.

| Component | Description                                             | Documentation           |
| --------- | ------------------------------------------------------- | ----------------------- |
| **Table** | Advanced data table with sorting, filtering, pagination | _Documentation pending_ |

### 🛠️ Utilities

Helper functions and utilities exported from the library.

| Utility                 | Description                    | Documentation           |
| ----------------------- | ------------------------------ | ----------------------- |
| **createColumns**       | Table column creation utility  | _Documentation pending_ |
| **createOptionCols**    | Option column creation utility | _Documentation pending_ |
| **useTablePreferences** | Table preferences hook         | _Documentation pending_ |
| **formReset**           | Form reset utility function    | _Documentation pending_ |

## 🚀 Quick Start

### Installation

```bash
npm install @g4rcez/components
```

### Basic Setup

```tsx
import { ComponentsProvider } from "@g4rcez/components";
import "@g4rcez/components/index.css";

function App() {
  return (
    <ComponentsProvider>
      <YourApp />
    </ComponentsProvider>
  );
}
```

### Individual Imports

```tsx
// Import specific components
import { Button } from "@g4rcez/components/button";
import { Input } from "@g4rcez/components/input";
import { Modal } from "@g4rcez/components/modal";

// Or import from main package
import { Button, Input, Modal } from "@g4rcez/components";
```

## 📚 Documentation Status

### ✅ Completed Documentation

- **Core Components**: Button, Polymorph, RenderOnView, Tag
- **Display Components**: Alert, Calendar, Card, Empty, Notifications, Progress, Skeleton, Tabs
- **Floating Components**: CommandPalette, Dropdown, Modal, Tooltip
- **Form Components**: Autocomplete, Checkbox, FileUpload, Input, Select

### 🚧 Pending Documentation

The following components are exported and functional but need detailed documentation:

**Display Components (4 remaining)**:

- List, Shortcut, Stats, Step, Timeline

**Floating Components (3 remaining)**:

- Expand, Menu, Toolbar

**Form Components (9 remaining)**:

- DatePicker, Form, InputField, MultiSelect, Radiobox, Slider, Switch, TaskList, Textarea, TransferList

**Table Components (1 remaining)**:

- Table (with utilities)

## 🎯 Component Categories Overview

### Core Components (4/4 documented)

Foundation components providing basic functionality, polymorphic capabilities, and performance optimizations.

### Display Components (8/12 documented)

Components focused on presenting information, organizing content, and providing visual feedback to users.

### Floating Components (4/6 documented)

Overlay components that appear above other content, using Floating UI for proper positioning and interactions.

### Form Components (5/14 documented)

Input and form-related components with built-in validation, accessibility features, and form library integration.

### Table Components (0/1 documented)

Advanced data table functionality with sorting, filtering, pagination, and virtualization support.

## 🎨 Tailwind CSS v4 Integration

All documented components now include comprehensive **Tailwind CSS v4 examples** showcasing:

- **CSS Variables** for dynamic theming
- **Container Queries** for element-based responsive design
- **CSS Grid Areas** for complex layouts
- **Color Functions** for advanced color manipulation
- **Modern Animations** with enhanced performance
- **Responsive Design Patterns** using container-aware styling

### Featured v4 Examples

| Component    | v4 Features Demonstrated                                                          |
| ------------ | --------------------------------------------------------------------------------- |
| **Button**   | CSS variables, container queries, dynamic styling, custom animations              |
| **Input**    | Responsive forms, locale-aware styling, validation animations, multi-step layouts |
| **Modal**    | Dynamic theming, container-based sizing, CSS Grid areas, modern animations        |
| **Card**     | Masonry layouts, hover effects, data visualization, adaptive components           |
| **Alert**    | Notification systems, progress indicators, stacking animations                    |
| **Tabs**     | Vertical layouts, CSS Grid areas, animated transitions, responsive behavior       |
| **Select**   | Dynamic theming, responsive forms, advanced state styling                         |
| **Checkbox** | Task lists, priority styling, animated states, complex layouts                    |

See [TAILWIND_V4_INTEGRATION.md](./TAILWIND_V4_INTEGRATION.md) for the complete integration guide.

## 🔗 Related Documentation

- [README.md](../README.md) - Project overview and setup
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical architecture details
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development and contribution guide
- [COMPONENTS.md](../COMPONENTS.md) - Complete API reference
- [TAILWIND_V4_INTEGRATION.md](./TAILWIND_V4_INTEGRATION.md) - **NEW** Tailwind CSS v4 integration guide

## 📝 Notes

- All documented components include comprehensive examples and use cases
- Components follow consistent API patterns and accessibility standards
- Each component supports TypeScript with full type safety
- Documentation includes responsive behavior and mobile considerations
- Examples demonstrate real-world usage patterns and best practices

---

**Total Components**: 38 exported components and utilities  
**Documented**: 21 components (55%)  
**Remaining**: 17 components (45%)

This index will be updated as more component documentation is completed.
