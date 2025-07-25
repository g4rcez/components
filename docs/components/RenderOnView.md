# RenderOnView Component

A performance optimization component that only renders its children when they come into the viewport. Uses the Intersection Observer API to detect when the component becomes visible.

## Import

```tsx
import { RenderOnView } from "@g4rcez/components";
```

## Basic Usage

```tsx
<RenderOnView>
  <ExpensiveComponent />
</RenderOnView>
```

## Props

| Prop             | Type                             | Default | Description                                   |
| ---------------- | -------------------------------- | ------- | --------------------------------------------- |
| `onIntersection` | `() => void`                     | -       | Callback fired when component enters viewport |
| `children`       | `React.ReactNode`                | -       | Content to render when visible                |
| `as`             | `React.ElementType`              | `"div"` | HTML element to render as                     |
| `...props`       | `React.ComponentPropsWithRef<T>` | -       | All props of the specified element type       |

## How It Works

1. **Initial State**: Component renders a placeholder element but no children
2. **Intersection Observer**: Monitors when the element enters the viewport
3. **Lazy Rendering**: Once visible, children are rendered and stay rendered
4. **Performance**: Prevents expensive components from rendering until needed

## Examples

### Basic Lazy Loading

```tsx
const App = () => {
  return (
    <div>
      <div style={{ height: "100vh" }}>
        Scroll down to see the lazy-loaded content
      </div>

      <RenderOnView>
        <ExpensiveChart data={largeDataset} />
      </RenderOnView>
    </div>
  );
};
```

### With Intersection Callback

```tsx
const App = () => {
  const handleIntersection = () => {
    console.log("Component is now visible!");
    // Track analytics, load data, etc.
  };

  return (
    <RenderOnView onIntersection={handleIntersection}>
      <LazyLoadedImage src="/large-image.jpg" />
    </RenderOnView>
  );
};
```

### Multiple Lazy Components

```tsx
const App = () => {
  return (
    <div>
      {/* Above the fold content */}
      <Header />
      <HeroSection />

      {/* Lazy loaded sections */}
      <RenderOnView>
        <FeaturesSection />
      </RenderOnView>

      <RenderOnView>
        <TestimonialsSection />
      </RenderOnView>

      <RenderOnView>
        <ContactForm />
      </RenderOnView>
    </div>
  );
};
```

### With Custom Element

```tsx
<RenderOnView as="section" className="lazy-section">
  <ComplexVisualization />
</RenderOnView>
```

### Loading State

```tsx
const LazySection = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <RenderOnView
      onIntersection={() => setIsVisible(true)}
      className="min-h-[200px] flex items-center justify-center"
    >
      {isVisible ? <HeavyComponent /> : <div>Loading...</div>}
    </RenderOnView>
  );
};
```

## Use Cases

### 1. **Long Pages with Heavy Components**

```tsx
// Blog post with multiple embedded widgets
<article>
  <h1>Blog Post Title</h1>
  <p>Introduction content...</p>

  <RenderOnView>
    <TwitterEmbed tweetId="123" />
  </RenderOnView>

  <p>More content...</p>

  <RenderOnView>
    <CodeSandboxEmbed sandboxId="abc" />
  </RenderOnView>
</article>
```

### 2. **Dashboard with Multiple Charts**

```tsx
const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Always visible summary */}
      <SummaryCards />

      {/* Lazy load expensive charts */}
      <RenderOnView>
        <RevenueChart />
      </RenderOnView>

      <RenderOnView>
        <UserAnalyticsChart />
      </RenderOnView>

      <RenderOnView>
        <PerformanceMetrics />
      </RenderOnView>
    </div>
  );
};
```

### 3. **Image Galleries**

```tsx
const Gallery = ({ images }) => {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <RenderOnView key={image.id}>
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy" // Combine with native lazy loading
          />
        </RenderOnView>
      ))}
    </div>
  );
};
```

### 4. **Analytics Tracking**

```tsx
const TrackableSection = ({ sectionName, children }) => {
  const trackView = () => {
    analytics.track("Section Viewed", { section: sectionName });
  };

  return <RenderOnView onIntersection={trackView}>{children}</RenderOnView>;
};
```

## Performance Benefits

1. **Reduced Initial Bundle**: Components not rendered until needed
2. **Faster Page Load**: Less JavaScript execution on initial render
3. **Memory Efficiency**: Fewer DOM nodes created initially
4. **Better User Experience**: Faster time to interactive

## Browser Support

- **Modern Browsers**: Full support with Intersection Observer API
- **Fallback**: Components render immediately if Intersection Observer is not available
- **Polyfill**: Can be used with intersection-observer polyfill for older browsers

## Best Practices

1. **Use for Heavy Components**: Best for components with significant rendering cost
2. **Combine with React.lazy**: Use together with code splitting for maximum benefit
3. **Consider Loading States**: Show placeholders or loading indicators
4. **Avoid for Critical Content**: Don't use for above-the-fold content
5. **Test Performance**: Measure actual performance improvements

## Advanced Usage

### With React.lazy

```tsx
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

<RenderOnView>
  <Suspense fallback={<div>Loading...</div>}>
    <HeavyComponent />
  </Suspense>
</RenderOnView>;
```

### With Custom Hook

```tsx
const useIntersectionTracking = (callback) => {
  return useCallback(() => {
    callback();
  }, [callback]);
};

const TrackedSection = ({ onView, children }) => {
  const handleIntersection = useIntersectionTracking(onView);

  return (
    <RenderOnView onIntersection={handleIntersection}>{children}</RenderOnView>
  );
};
```

## Notes

- Once a component becomes visible, it stays rendered (no re-hiding)
- The intersection callback fires only once when first entering viewport
- Uses `useLayoutEffect` for synchronous DOM measurements
- Automatically cleans up Intersection Observer on unmount
- Supports all standard HTML element props through polymorphic design
- The component itself always renders (as a placeholder), only children are conditional
