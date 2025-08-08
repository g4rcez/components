# Skeleton Component

A loading skeleton component for creating placeholder content while data is loading. Provides a pre-built skeleton cell optimized for table layouts with pulse animation.

## Import

```tsx
import { SkeletonCell } from "@g4rcez/components/skeleton";
```

## Basic Usage

```tsx
<SkeletonCell />
```

## Component Structure

The `SkeletonCell` is a simple pre-built skeleton component:

```tsx
<div className="h-2 w-10/12 animate-pulse rounded bg-table-border" />
```

## Examples

### Table Loading Skeleton

```tsx
function TableSkeleton() {
  return (
    <table className="w-full">
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="border-b">
            <td className="py-3 px-4">
              <SkeletonCell />
            </td>
            <td className="py-3 px-4">
              <SkeletonCell />
            </td>
            <td className="py-3 px-4">
              <SkeletonCell />
            </td>
            <td className="py-3 px-4">
              <SkeletonCell />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Card Loading Skeleton

```tsx
function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      {/* Title skeleton */}
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      
      {/* Content skeleton using SkeletonCell */}
      <div className="space-y-2">
        <SkeletonCell />
        <SkeletonCell />
        <div className="h-2 w-1/2 animate-pulse rounded bg-table-border" />
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
```

### List Loading Skeleton

```tsx
function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-1">
            <SkeletonCell />
            <div className="h-2 w-1/3 animate-pulse rounded bg-table-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Custom Skeleton Components

While `SkeletonCell` is pre-built, you can create custom skeleton components using the same patterns:

```tsx
// Custom skeleton for different use cases
function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return <div className={`h-2 ${width} animate-pulse rounded bg-table-border`} />;
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine 
          key={index}
          width={index === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({ size = "w-10 h-10" }: { size?: string }) {
  return <div className={`${size} rounded-full animate-pulse bg-gray-200`} />;
}

function SkeletonButton({ width = "w-20" }: { width?: string }) {
  return <div className={`h-8 ${width} animate-pulse rounded bg-gray-200`} />;
}
```

### Data Loading States

```tsx
function DataTable({ data, loading }: { data?: any[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <SkeletonAvatar size="w-8 h-8" />
                    <SkeletonCell />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <SkeletonCell />
                </td>
                <td className="py-3 px-4">
                  <SkeletonButton width="w-16" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <SkeletonButton width="w-6" />
                    <SkeletonButton width="w-6" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <table className="w-full border rounded-lg">
      {/* Actual table content */}
      <tbody>
        {data?.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.status}</td>
            <td>{/* actions */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Progressive Loading

```tsx
function ProgressiveCard({ data }: { data?: any }) {
  return (
    <div className="border rounded-lg p-6">
      <div className="space-y-4">
        {/* Title loads first */}
        {data?.title ? (
          <h2 className="text-xl font-semibold">{data.title}</h2>
        ) : (
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        )}

        {/* Description loads second */}
        {data?.description ? (
          <p className="text-gray-600">{data.description}</p>
        ) : (
          <div className="space-y-2">
            <SkeletonCell />
            <SkeletonCell />
            <div className="h-2 w-1/2 animate-pulse rounded bg-table-border" />
          </div>
        )}

        {/* Actions load last */}
        {data?.actions ? (
          <div className="flex gap-2">
            {data.actions.map((action: any) => (
              <button key={action.id} className="px-3 py-1 bg-blue-500 text-white rounded">
                {action.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            <SkeletonButton width="w-20" />
            <SkeletonButton width="w-16" />
          </div>
        )}
      </div>
    </div>
  );
}
```

### Grid Layout Skeleton

```tsx
function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          {/* Image placeholder */}
          <div className="w-full h-32 animate-pulse rounded bg-gray-200" />
          
          {/* Content placeholder */}
          <div className="space-y-2">
            <SkeletonCell />
            <div className="h-2 w-2/3 animate-pulse rounded bg-table-border" />
          </div>
          
          {/* Footer placeholder */}
          <div className="flex justify-between items-center">
            <SkeletonButton width="w-16" />
            <div className="h-2 w-12 animate-pulse rounded bg-table-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Animated Skeleton Variants

```tsx
// Shimmer effect skeleton
function ShimmerSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="h-4 bg-gray-200 rounded">
        <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    </div>
  );
}

// Wave effect skeleton  
function WaveSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-2 bg-gray-200 rounded animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="h-2 bg-gray-200 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
      <div className="h-2 bg-gray-200 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
    </div>
  );
}
```

## Best Practices

1. **Match Content Structure**: Design skeletons that match your actual content layout
2. **Use Consistent Sizing**: Keep skeleton dimensions similar to real content
3. **Progressive Loading**: Show skeletons for parts still loading while displaying loaded content
4. **Responsive Design**: Ensure skeletons work on all screen sizes
5. **Performance**: Use CSS animations instead of JavaScript for better performance

## CSS Animation

The skeleton uses Tailwind's built-in `animate-pulse` class. You can customize it:

```css
/* Custom pulse animation */
@keyframes custom-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-custom-pulse {
  animation: custom-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Accessibility

- Skeleton components are purely visual and don't need special accessibility considerations
- Use `aria-live="polite"` on containers that will show real content to announce when loading is complete
- Consider adding `aria-label="Loading content"` to skeleton containers for screen readers

```tsx
<div aria-live="polite" aria-label="Loading content">
  {loading ? <SkeletonCell /> : <ActualContent />}
</div>
```

## Related Components

- **Empty**: For when no data is available
- **Progress**: For loading progress indication
- **Notifications**: For loading state notifications