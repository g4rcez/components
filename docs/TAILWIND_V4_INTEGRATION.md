# Tailwind CSS v4 Integration Guide

This guide demonstrates how to leverage Tailwind CSS v4's advanced features with @g4rcez/components for modern, responsive, and highly customizable user interfaces.

## Table of Contents

- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
- [Key Features](#key-features)
- [CSS Variables and Custom Properties](#css-variables-and-custom-properties)
- [Container Queries](#container-queries)
- [CSS Grid Areas](#css-grid-areas)
- [Color Functions](#color-functions)
- [Modern Animations](#modern-animations)
- [Responsive Design Patterns](#responsive-design-patterns)
- [Best Practices](#best-practices)
- [Migration from v3](#migration-from-v3)

## Overview

Tailwind CSS v4 introduces powerful new features that enhance the @g4rcez/components library:

- **CSS Variables**: Dynamic theming with CSS custom properties
- **Container Queries**: Element-based responsive design
- **Enhanced Color Functions**: Advanced color manipulation
- **CSS Grid Areas**: Named grid layouts
- **Improved Animations**: Better keyframe and transition support
- **Better Performance**: Optimized CSS generation

## Setup and Configuration

### Installation

```bash
# Install Tailwind CSS v4 (when available)
npm install tailwindcss@next

# Install the components library
npm install @g4rcez/components
```

### Configuration

```js
// tailwind.config.js
module.exports = {
  presets: [require("@g4rcez/components/preset.tailwind")],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@g4rcez/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
      colors: {
        brand: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      container: {
        queries: {
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    // Other plugins
  ],
};
```

### CSS Setup

```css
/* styles/globals.css */
@import "tailwindcss";
@import "@g4rcez/components/index.css";

/* Custom CSS variables for theming */
@theme {
  --color-brand-primary: #3b82f6;
  --color-brand-secondary: #64748b;
  --color-brand-accent: #8b5cf6;

  --spacing-component: 1rem;
  --radius-component: 0.5rem;

  --shadow-component: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Custom animations */
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

@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
```

## Key Features

### CSS Variables and Custom Properties

Tailwind v4's enhanced CSS variable support allows for dynamic theming:

```tsx
// Dynamic theme switching
const ThemeProvider = ({ theme, children }) => {
  const themeVars = {
    light: {
      "--bg-primary": "theme(colors.white)",
      "--text-primary": "theme(colors.gray.900)",
      "--border-primary": "theme(colors.gray.200)",
    },
    dark: {
      "--bg-primary": "theme(colors.gray.900)",
      "--text-primary": "theme(colors.white)",
      "--border-primary": "theme(colors.gray.700)",
    },
  };

  return (
    <div
      style={themeVars[theme]}
      className="bg-[--bg-primary] text-[--text-primary]"
    >
      {children}
    </div>
  );
};

// Usage with components
<Button className="bg-[--bg-primary] border-[--border-primary]">
  Themed Button
</Button>;
```

### Container Queries

Element-based responsive design that adapts to container size rather than viewport:

```tsx
// Responsive card grid
<div className="@container">
  <div className="grid @sm:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
    <Card className="@container">
      <Card.Title title="Responsive Card">
        <Button className="@sm:w-full @lg:w-auto">Action</Button>
      </Card.Title>
      <div className="@sm:text-sm @lg:text-base">
        Content that adapts to card size
      </div>
    </Card>
  </div>
</div>
```

### CSS Grid Areas

Named grid areas for complex layouts:

```tsx
// Dashboard layout with named areas
<div
  className="
  grid 
  [grid-template-areas:'header_header''sidebar_main''footer_footer'] 
  @lg:[grid-template-areas:'header_header_header''sidebar_main_aside''footer_footer_footer']
  grid-rows-[auto_1fr_auto] 
  @lg:grid-cols-[250px_1fr_200px] 
  min-h-screen
"
>
  <header className="[grid-area:header] bg-white border-b p-4">
    <h1>Dashboard</h1>
  </header>

  <aside className="[grid-area:sidebar] bg-gray-50 p-4">
    <nav>Navigation</nav>
  </aside>

  <main className="[grid-area:main] p-6">
    <Card title="Main Content">
      <p>Dashboard content</p>
    </Card>
  </main>

  <aside className="[grid-area:aside] @lg:block hidden bg-gray-50 p-4">
    <div>Sidebar content</div>
  </aside>

  <footer className="[grid-area:footer] bg-white border-t p-4">
    <p>Footer</p>
  </footer>
</div>
```

### Color Functions

Advanced color manipulation with CSS color functions:

```tsx
// Dynamic color mixing
const ColorMixButton = ({ baseColor = "blue", intensity = 80 }) => {
  return (
    <Button
      className="transition-all duration-300"
      style={{
        "--btn-bg": `color-mix(in srgb, theme(colors.${baseColor}.500) ${intensity}%, white)`,
        "--btn-hover": `color-mix(in srgb, theme(colors.${baseColor}.600) ${intensity}%, white)`,
        "--btn-text": `color-mix(in srgb, theme(colors.${baseColor}.900) 90%, black)`,
        backgroundColor: "var(--btn-bg)",
        color: "var(--btn-text)",
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "var(--btn-hover)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "var(--btn-bg)";
      }}
    >
      Color Mix Button
    </Button>
  );
};
```

### Modern Animations

Enhanced animation support with better performance:

```tsx
// Staggered animations
const AnimatedList = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <Card
          key={item.id}
          className="animate-[fadeInUp_0.6s_ease-out] hover:animate-[pulse-soft_2s_ease-in-out_infinite]"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: "both",
          }}
        >
          <p>{item.content}</p>
        </Card>
      ))}
    </div>
  );
};

// Scroll-triggered animations
const ScrollAnimatedSection = () => {
  return (
    <div
      className="
      opacity-0 translate-y-8 
      animate-[fadeInUp_0.8s_ease-out_forwards]
      [animation-timeline:view()]
      [animation-range:entry_0%_entry_50%]
    "
    >
      <Card title="Scroll Animated Content">
        <p>This content animates when scrolled into view.</p>
      </Card>
    </div>
  );
};
```

## Responsive Design Patterns

### Mobile-First Container Queries

```tsx
// Progressive enhancement with container queries
const ResponsiveForm = () => {
  return (
    <div className="@container max-w-4xl mx-auto p-4">
      <Card className="@container">
        <Card.Title title="Responsive Form" />

        <form
          className="
          grid gap-4
          @sm:grid-cols-1 
          @md:grid-cols-2 
          @lg:grid-cols-3
          @xl:grid-cols-4
        "
        >
          <Input placeholder="Name" className="@sm:col-span-1 @lg:col-span-2" />
          <Input
            placeholder="Email"
            className="@sm:col-span-1 @lg:col-span-2"
          />
          <Select
            options={countryOptions}
            placeholder="Country"
            className="@sm:col-span-1"
          />
          <Select
            options={stateOptions}
            placeholder="State"
            className="@sm:col-span-1"
          />
          <Input placeholder="City" className="@sm:col-span-1" />
          <Input placeholder="ZIP" className="@sm:col-span-1" />

          <div className="@sm:col-span-1 @md:col-span-2 @lg:col-span-3 @xl:col-span-4">
            <Button className="@sm:w-full @md:w-auto">Submit Form</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
```

### Adaptive Component Layouts

```tsx
// Components that change behavior based on available space
const AdaptiveNavigation = () => {
  return (
    <nav className="@container">
      {/* Horizontal navigation on larger containers */}
      <div className="@lg:flex @lg:items-center @lg:space-x-4 @lg:space-y-0 space-y-2">
        <Button className="@lg:w-auto w-full">Home</Button>
        <Button className="@lg:w-auto w-full">About</Button>
        <Button className="@lg:w-auto w-full">Services</Button>
        <Button className="@lg:w-auto w-full">Contact</Button>
      </div>

      {/* Dropdown menu on smaller containers */}
      <div className="@lg:hidden">
        <Modal trigger={<Button>Menu</Button>} type="sheet" title="Navigation">
          <div className="space-y-2">
            <Button className="w-full justify-start">Home</Button>
            <Button className="w-full justify-start">About</Button>
            <Button className="w-full justify-start">Services</Button>
            <Button className="w-full justify-start">Contact</Button>
          </div>
        </Modal>
      </div>
    </nav>
  );
};
```

## Best Practices

### 1. Use CSS Variables for Theming

```tsx
// Define theme variables at the root level
const AppTheme = ({ theme, children }) => {
  const themes = {
    light: {
      "--color-bg": "theme(colors.white)",
      "--color-text": "theme(colors.gray.900)",
      "--color-primary": "theme(colors.blue.500)",
      "--color-border": "theme(colors.gray.200)",
    },
    dark: {
      "--color-bg": "theme(colors.gray.900)",
      "--color-text": "theme(colors.white)",
      "--color-primary": "theme(colors.blue.400)",
      "--color-border": "theme(colors.gray.700)",
    },
  };

  return (
    <div style={themes[theme]} className="bg-[--color-bg] text-[--color-text]">
      {children}
    </div>
  );
};
```

### 2. Leverage Container Queries for True Responsive Design

```tsx
// Component-level responsiveness
const ResponsiveCard = ({ children }) => {
  return (
    <Card className="@container">
      <div
        className="
        @sm:p-4 @md:p-6 @lg:p-8
        @sm:text-sm @md:text-base @lg:text-lg
        @sm:space-y-2 @md:space-y-4 @lg:space-y-6
      "
      >
        {children}
      </div>
    </Card>
  );
};
```

### 3. Use CSS Grid Areas for Complex Layouts

```tsx
// Named grid areas for maintainable layouts
const DashboardLayout = () => {
  return (
    <div
      className="
      grid min-h-screen
      [grid-template-areas:'header''main''footer']
      @lg:[grid-template-areas:'header_header''sidebar_main''footer_footer']
      grid-rows-[auto_1fr_auto]
      @lg:grid-cols-[250px_1fr]
    "
    >
      <header className="[grid-area:header]">Header</header>
      <aside className="[grid-area:sidebar] @lg:block hidden">Sidebar</aside>
      <main className="[grid-area:main]">Main Content</main>
      <footer className="[grid-area:footer]">Footer</footer>
    </div>
  );
};
```

### 4. Implement Progressive Enhancement

```tsx
// Start with basic functionality, enhance with advanced features
const ProgressiveButton = ({ children, ...props }) => {
  return (
    <Button
      className="
        /* Base styles */
        px-4 py-2 rounded
        
        /* Enhanced hover effects */
        hover:scale-105 
        hover:shadow-lg
        
        /* Advanced animations (if supported) */
        @supports_(backdrop-filter:blur(10px)) {
          backdrop-blur-sm bg-white/80
        }
        
        /* Container-aware sizing */
        @sm:px-3 @sm:py-1.5 @sm:text-sm
        @lg:px-6 @lg:py-3 @lg:text-base
      "
      {...props}
    >
      {children}
    </Button>
  );
};
```

## Migration from v3

### Key Changes

1. **Container Queries**: Replace viewport-based responsive design
2. **CSS Variables**: Enhanced support for dynamic theming
3. **Color Functions**: New color manipulation capabilities
4. **Grid Areas**: Named grid layouts for complex designs

### Migration Steps

```tsx
// Before (Tailwind v3)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="p-4 md:p-6">
    <h3 className="text-lg md:text-xl">Title</h3>
  </Card>
</div>

// After (Tailwind v4)
<div className="@container">
  <div className="grid @sm:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
    <Card className="@container @sm:p-4 @md:p-6">
      <h3 className="@sm:text-lg @md:text-xl">Title</h3>
    </Card>
  </div>
</div>
```

### Gradual Migration Strategy

1. **Start with CSS Variables**: Replace hardcoded colors
2. **Add Container Queries**: Enhance existing responsive designs
3. **Implement Grid Areas**: Refactor complex layouts
4. **Optimize Animations**: Use new animation features

## Performance Considerations

### CSS Generation Optimization

```js
// tailwind.config.js
module.exports = {
  // Enable JIT mode for better performance
  mode: "jit",

  // Optimize for production
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    options: {
      safelist: [
        // Safelist dynamic classes
        /^@/, // Container query classes
        /^grid-area-/, // Grid area classes
      ],
    },
  },
};
```

### Runtime Performance

```tsx
// Use CSS variables to avoid inline style recalculation
const OptimizedComponent = ({ theme }) => {
  // Good: CSS variables
  return (
    <div
      className="bg-[--theme-bg] text-[--theme-text]"
      style={{
        "--theme-bg": `theme(colors.${theme}.50)`,
        "--theme-text": `theme(colors.${theme}.900)`,
      }}
    >
      Content
    </div>
  );

  // Avoid: Inline styles that change frequently
  // return (
  //   <div style={{
  //     backgroundColor: colors[theme][50],
  //     color: colors[theme][900]
  //   }}>
  //     Content
  //   </div>
  // );
};
```

## Conclusion

Tailwind CSS v4 brings powerful new features that enhance the @g4rcez/components library with:

- **Better Responsive Design** through container queries
- **Dynamic Theming** with CSS variables
- **Complex Layouts** using CSS Grid areas
- **Advanced Styling** with color functions
- **Improved Performance** through optimized CSS generation

By following the patterns and best practices outlined in this guide, you can create modern, responsive, and highly customizable user interfaces that adapt to any context or container size.

---

For more examples and detailed component documentation, see the individual component documentation files that include Tailwind CSS v4 integration examples.
