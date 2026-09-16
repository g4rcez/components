---
title: RenderOnView
description: A performance wrapper that defers rendering children until the container enters the viewport.
package: "@g4rcez/components"
export: "{ RenderOnView }"
import: "import { RenderOnView } from '@g4rcez/components'"
category: core
---

# RenderOnView

A performance wrapper that defers rendering its children until the container element enters the viewport. Uses the `IntersectionObserver` API and keeps children mounted after they first appear.

## Import

```tsx
import { RenderOnView } from "@g4rcez/components";
```

## Props

| Prop             | Type                                | Default | Description                                             |
| ---------------- | ----------------------------------- | ------- | ------------------------------------------------------- |
| `onIntersection` | `() => void`                        | -       | Called when the container intersects.                   |
| `children`       | `React.ReactNode`                   | -       | Content rendered when the container is visible.         |
| `as`             | `React.ElementType`                 | `"div"` | Accepted for compatibility; ignored; renders a `<div>`. |
| `...props`       | `React.ComponentPropsWithoutRef<T>` | -       | Props forwarded to the rendered `<div>`.                |

## Design Tokens

None — `RenderOnView` is a layout/performance primitive that applies no
styles of its own.

## How It Works

1. **Initial state**: The container renders immediately, but children are
   not mounted.
2. **Intersection Observer**: `useLayoutEffect` observes the container.
3. **First intersection**: `shouldRender` flips to `true` and children mount.
4. **Stays mounted**: Children remain mounted after the first intersection.
5. **Callback**: `onIntersection` fires for each intersecting entry; guard it
   when the effect should run only once.

## Examples

### Basic Lazy Rendering

```tsx
<div>
    <div className="h-screen flex items-center justify-center text-foreground">
        Scroll down to see lazy content
    </div>

    <RenderOnView>
        <ExpensiveChart data={largeDataset} />
    </RenderOnView>
</div>
```

### With Intersection Callback

```tsx
const TrackableSection = ({ sectionName, children }) => {
    const handleIntersection = () =>
        analytics.track("Section Viewed", { section: sectionName });

    return (
        <RenderOnView onIntersection={handleIntersection}>
            {children}
        </RenderOnView>
    );
};
```

### Multiple Deferred Sections

```tsx
<main>
    <HeroSection />

    <RenderOnView>
        <FeaturesSection />
    </RenderOnView>

    <RenderOnView>
        <TestimonialsSection />
    </RenderOnView>

    <RenderOnView>
        <ContactForm />
    </RenderOnView>
</main>
```

### With React.lazy and Suspense

```tsx
import { lazy, Suspense } from "react";
import { Spinner } from "@g4rcez/components";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

<RenderOnView>
    <Suspense fallback={<Spinner />}>
        <HeavyComponent />
    </Suspense>
</RenderOnView>;
```

## Do

- Use `RenderOnView` for expensive components such as charts, maps, and
  rich editors.
- Combine it with `React.lazy` and `Suspense` for bundle and rendering
  savings.
- Use a semantic wrapper when the container needs an element other than `<div>`;
  the current implementation does not apply the `as` prop.
- Use design-token classes on wrapper divs inside children
  (`bg-background`, `border-border`).

## Don't

- Don't use it for above-the-fold content; it adds an unnecessary observer.
- Don't rely on it for critical content that must be in the initial HTML
  (SEO or LCP elements).
- Don't pass raw utility color classes (`bg-white`, `text-gray-800`) to children;
  use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`); override CSS variables in
  your `@theme` block.

## Accessibility

- The container element is always rendered and present in the DOM.
- Children mount only when visible, so screen readers encounter them as they
  scroll into view.
- Ensure interactive content has proper focus management after mounting.

## Notes

- Children render once and are never unmounted, regardless of scroll position.
- `onIntersection` can fire more than once when the element re-enters or the
  observer reports another intersecting entry.
- The `IntersectionObserver` disconnects on component unmount.
- `useLayoutEffect` sets up the observer synchronously to avoid a flash of an
  empty container.
- The public polymorphic `as` prop is currently ignored; use a wrapper when a
  semantic container is required.
- SSR-safe: initial `shouldRender` is `false` because `ref.current` is `null`
  on the server.
