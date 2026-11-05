---
title: RenderOnView
description: A performance wrapper that defers rendering children until the container enters the viewport.
package: "@g4rcez/components"
export: "{ RenderOnView }"
import: "import { RenderOnView } from '@g4rcez/components'"
category: core
---

# RenderOnView

A performance wrapper. It defers rendering its children until the container element enters the viewport. It uses the `IntersectionObserver` API and keeps children mounted after they first appear.

## Import

```tsx
import { RenderOnView } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onIntersection` | `() => void` | - | Called when the container intersects. |
| `children` | `React.ReactNode` | - | Content rendered when the container is visible. |
| `as` | `React.ElementType` | `"div"` | Accepted for compatibility. Ignored. Renders a `<div>`. |
| `...props` | `React.ComponentPropsWithoutRef<T>` | - | Props forwarded to the rendered `<div>`. |

## Design Tokens

None. `RenderOnView` applies no styles.

## How It Works

1. **Initial state**: The container renders immediately. Children are not mounted.
2. **Intersection Observer**: `useLayoutEffect` observes the container.
3. **First intersection**: `shouldRender` becomes `true` and children mount.
4. **Stays mounted**: Children stay mounted after the first intersection.
5. **Callback**: `onIntersection` fires for each intersecting entry. Guard it when the effect MUST run once.

## Examples

### Basic Lazy Rendering

```tsx
<div>
    {" "}
    <div className="h-screen flex items-center justify-center text-foreground">Scroll down to see lazy content</div>{" "}
    <RenderOnView>
        {" "}
        <ExpensiveChart data={largeDataset} />{" "}
    </RenderOnView>
</div>
```

### With Intersection Callback

```tsx
const TrackableSection = ({ sectionName, children }) => {
    const handleIntersection = () => analytics.track("Section Viewed", { section: sectionName });
    return <RenderOnView onIntersection={handleIntersection}>{children}</RenderOnView>;
};
```

### Multiple Deferred Sections

```tsx
<main>
    {" "}
    <HeroSection />{" "}
    <RenderOnView>
        {" "}
        <FeaturesSection />{" "}
    </RenderOnView>{" "}
    <RenderOnView>
        {" "}
        <TestimonialsSection />{" "}
    </RenderOnView>{" "}
    <RenderOnView>
        {" "}
        <ContactForm />{" "}
    </RenderOnView>
</main>
```

### With React.lazy and Suspense

```tsx
import { lazy, Suspense } from "react";
import { Spinner } from "@g4rcez/components";
const HeavyComponent = lazy(() => import("./HeavyComponent"));
<RenderOnView>
    {" "}
    <Suspense fallback={<Spinner />}>
        {" "}
        <HeavyComponent />{" "}
    </Suspense>
</RenderOnView>;
```

## Do

- Use `RenderOnView` for expensive components such as charts, maps, and rich editors.
- Combine it with `React.lazy` and `Suspense` for bundle and rendering savings.
- Use a wrapper element when the container needs an element other than `<div>`. The `as` prop has no effect.
- Use design-token classes on wrapper divs inside children (`bg-background`, `border-border`).

## Don't

- Don't use it for above-the-fold content. It adds an unnecessary observer.
- Don't use it for critical content that must be in the initial HTML (SEO or LCP elements).
- Don't pass raw utility color classes (`bg-white`, `text-gray-800`) to children. Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Accessibility

- The container element is always in the DOM.
- Children mount only when visible. Screen readers find them as they scroll into view.
- Manage focus for interactive content after it mounts.

## Notes

- Children render once and never unmount, at any scroll position.
- `onIntersection` can fire more than once when the element re-enters or the observer reports another intersecting entry.
- The `IntersectionObserver` disconnects on unmount.
- `useLayoutEffect` sets up the observer synchronously. This avoids a flash of an empty container.
- SSR-safe: initial `shouldRender` is `false` because `ref.current` is `null` on the server.
