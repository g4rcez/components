# @g4rcez/components

A comprehensive React component library built with TypeScript, Tailwind CSS, and modern web technologies. This library provides a complete set of customizable, accessible, and performant UI components for building modern web applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Component Categories](#component-categories)
- [Theming & Customization](#theming--customization)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

This is a monorepo containing:

- **`packages/lib/`** - The main component library (`@g4rcez/components`)
- **`packages/docs/`** - Documentation and examples site built with Next.js

### Key Features

- 🎨 **Fully Customizable** - Theme system with light/dark mode support
- ♿ **Accessible** - Built with accessibility best practices
- 🔧 **TypeScript First** - Complete type safety and IntelliSense support
- 🎯 **Tree Shakeable** - Import only what you need
- 📱 **Responsive** - Mobile-first design approach
- 🚀 **Modern Stack** - React 18+, TypeScript, Tailwind CSS

## 🏗️ Architecture

### Project Structure

```
packages/
├── lib/                          # Main component library
│   ├── src/
│   │   ├── components/           # All UI components
│   │   │   ├── core/            # Basic components (Button, Tag, etc.)
│   │   │   ├── form/            # Form components (Input, Select, etc.)
│   │   │   ├── display/         # Display components (Alert, Card, etc.)
│   │   │   ├── floating/        # Floating components (Modal, Tooltip, etc.)
│   │   │   └── table/           # Table components and utilities
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── styles/              # Theme system and design tokens
│   │   └── config/              # Configuration and context
│   └── dist/                    # Built library files
└── docs/                        # Documentation site
    ├── src/app/docs/            # Component documentation pages
    └── src/components/examples/ # Live component examples
```

### Component Organization

Components are organized into logical categories:

- **Core**: Basic building blocks (`Button`, `Tag`, `Polymorph`)
- **Form**: Input and form-related components (`Input`, `Select`, `Checkbox`, etc.)
- **Display**: Information display components (`Alert`, `Card`, `Timeline`, etc.)
- **Floating**: Overlay components (`Modal`, `Tooltip`, `Dropdown`, etc.)
- **Table**: Data table components with advanced features

## 📦 Installation

```bash
npm install @g4rcez/components
# or
yarn add @g4rcez/components
# or
pnpm add @g4rcez/components
```

### CSS Import

Import the component styles in your app:

```tsx
import "@g4rcez/components/index.css";
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { Button, Input, Modal } from "@g4rcez/components";

function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text..." />
    </div>
  );
}
```

### With Provider (Recommended)

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

## 🧩 Component Categories

### Core Components

| Component   | Description                       | Import                                               |
| ----------- | --------------------------------- | ---------------------------------------------------- |
| `Button`    | Customizable button with variants | `import { Button } from "@g4rcez/components/button"` |
| `Tag`       | Label/badge component             | `import { Tag } from "@g4rcez/components/tag"`       |
| `Polymorph` | Polymorphic component base        | `import { Polymorph } from "@g4rcez/components"`     |

### Form Components

| Component      | Description                        | Import                                                           |
| -------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `Input`        | Text input with mask support       | `import { Input } from "@g4rcez/components/input"`               |
| `Select`       | Native select with styling         | `import { Select } from "@g4rcez/components/select"`             |
| `Autocomplete` | Searchable select with floating UI | `import { Autocomplete } from "@g4rcez/components/autocomplete"` |
| `Checkbox`     | Checkbox input                     | `import { Checkbox } from "@g4rcez/components/checkbox"`         |
| `Switch`       | Toggle switch                      | `import { Switch } from "@g4rcez/components/switch"`             |
| `DatePicker`   | Date selection component           | `import { DatePicker } from "@g4rcez/components/date-picker"`    |
| `FileUpload`   | File upload with drag & drop       | `import { FileUpload } from "@g4rcez/components/file-upload"`    |
| `Form`         | Form wrapper with validation       | `import { Form } from "@g4rcez/components/form"`                 |

### Display Components

| Component  | Description                 | Import                                                   |
| ---------- | --------------------------- | -------------------------------------------------------- |
| `Alert`    | Alert/notification messages | `import { Alert } from "@g4rcez/components/alert"`       |
| `Card`     | Content container           | `import { Card } from "@g4rcez/components/card"`         |
| `Calendar` | Calendar display            | `import { Calendar } from "@g4rcez/components/calendar"` |
| `Timeline` | Timeline/stepper component  | `import { Timeline } from "@g4rcez/components/timeline"` |
| `Tabs`     | Tab navigation              | `import { Tabs } from "@g4rcez/components/tabs"`         |
| `Stats`    | Statistics display          | `import { Stats } from "@g4rcez/components/stats"`       |

### Floating Components

| Component  | Description   | Import                                                   |
| ---------- | ------------- | -------------------------------------------------------- |
| `Modal`    | Modal dialog  | `import { Modal } from "@g4rcez/components/modal"`       |
| `Tooltip`  | Hover tooltip | `import { Tooltip } from "@g4rcez/components/tooltip"`   |
| `Dropdown` | Dropdown menu | `import { Dropdown } from "@g4rcez/components/dropdown"` |
| `Menu`     | Context menu  | `import { Menu } from "@g4rcez/components/menu"`         |

### Table Components

| Component | Description         | Import                                             |
| --------- | ------------------- | -------------------------------------------------- |
| `Table`   | Advanced data table | `import { Table } from "@g4rcez/components/table"` |

## 🎨 Theming & Customization

### Theme System

The library includes a comprehensive theme system with design tokens:

```tsx
import { ComponentsProvider } from "@g4rcez/components";

// Custom theme
const customTheme = {
  colors: {
    primary: "#your-color",
    // ... other colors
  },
  // ... other theme properties
};

function App() {
  return (
    <ComponentsProvider theme={customTheme}>
      <YourApp />
    </ComponentsProvider>
  );
}
```

### Tailwind Integration

Use the provided Tailwind preset:

```js
// tailwind.config.js
module.exports = {
  presets: [require("@g4rcez/components/preset.tailwind")],
  // ... your config
};
```

### Design Tokens

Access design tokens programmatically:

```tsx
import { designTokens } from "@g4rcez/components/styles";
```

## 🛠️ Development

### Prerequisites

- Node.js >= 20.14.0
- pnpm (recommended package manager)

### Setup

```bash
# Clone the repository
git clone https://github.com/g4rcez/components.git
cd components

# Install dependencies
pnpm install

# Start development server (docs site)
pnpm dev

# Build the library
pnpm build
```

### Scripts

- `pnpm dev` - Start docs development server
- `pnpm build` - Build both library and docs
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier

### Testing

```bash
# Run tests
cd packages/lib
pnpm test

# Watch mode
pnpm test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pnpm test`
6. Format code: `pnpm format`
7. Commit changes: `git commit -m 'Add amazing feature'`
8. Push to branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Component Development Guidelines

1. **TypeScript First** - All components must be fully typed
2. **Accessibility** - Follow WCAG guidelines
3. **Testing** - Include unit tests for new components
4. **Documentation** - Add examples to the docs site
5. **Consistency** - Follow existing patterns and conventions

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/g4rcez/components)
- [NPM Package](https://www.npmjs.com/package/@g4rcez/components)
- [Author](https://garcez.dev)

---

Built with ❤️ by [Allan Garcez](https://garcez.dev)
