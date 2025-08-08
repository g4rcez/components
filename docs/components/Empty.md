# Empty Component

A simple empty state component to display when no data, results, or content is available. Features customizable icons and internationalized messages.

## Import

```tsx
import { Empty } from "@g4rcez/components/empty";
```

## Basic Usage

```tsx
<Empty />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `Icon` | `React.FC<LucideProps>` | `FileIcon` | Custom icon component from Lucide React |
| `message` | `string` | Localized "No data available" | Custom empty state message |

## Examples

### Default Empty State

```tsx
<Empty />
// Displays: File icon with "No data available" message
```

### Custom Message

```tsx
<Empty message="No items found" />
```

### Custom Icon

```tsx
import { SearchIcon, InboxIcon, UsersIcon } from "lucide-react";

// Search results
<Empty 
  Icon={SearchIcon}
  message="No search results found"
/>

// Inbox
<Empty 
  Icon={InboxIcon}
  message="Your inbox is empty"
/>

// Users list
<Empty 
  Icon={UsersIcon}
  message="No users to display"
/>
```

### In Data Tables

```tsx
function DataTable({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="py-12">
        <Empty 
          Icon={DatabaseIcon}
          message="No records found"
        />
      </div>
    );
  }
  
  return (
    <table>
      {/* Table content */}
    </table>
  );
}
```

### In Lists

```tsx
function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-4">
      <h2>My Tasks</h2>
      
      {tasks.length === 0 ? (
        <Empty 
          Icon={CheckCircleIcon}
          message="All tasks completed! 🎉"
        />
      ) : (
        <ul>
          {tasks.map(task => <TaskItem key={task.id} task={task} />)}
        </ul>
      )}
    </div>
  );
}
```

### In Search Results

```tsx
function SearchResults({ query, results }: { query: string; results: any[] }) {
  if (results.length === 0 && query) {
    return (
      <Empty 
        Icon={SearchXIcon}
        message={`No results found for "${query}"`}
      />
    );
  }
  
  if (results.length === 0) {
    return (
      <Empty 
        Icon={SearchIcon}
        message="Start typing to search..."
      />
    );
  }
  
  return (
    <div>
      {results.map(result => <ResultItem key={result.id} result={result} />)}
    </div>
  );
}
```

### In Card Layouts

```tsx
function Dashboard({ widgets }: { widgets: Widget[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgets.length === 0 ? (
        <div className="col-span-full">
          <div className="border border-dashed border-gray-300 rounded-lg p-12">
            <Empty 
              Icon={PlusIcon}
              message="No widgets added yet. Click to add your first widget."
            />
          </div>
        </div>
      ) : (
        widgets.map(widget => <WidgetCard key={widget.id} widget={widget} />)
      )}
    </div>
  );
}
```

## Advanced Examples

### Contextual Empty States

```tsx
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  BellIcon,
  MailIcon,
  FolderIcon 
} from "lucide-react";

// Different contexts
const EmptyStates = {
  cart: <Empty Icon={ShoppingCartIcon} message="Your cart is empty" />,
  favorites: <Empty Icon={HeartIcon} message="No favorites yet" />,
  notifications: <Empty Icon={BellIcon} message="No notifications" />,
  messages: <Empty Icon={MailIcon} message="No messages" />,
  files: <Empty Icon={FolderIcon} message="This folder is empty" />
};
```

### With Action Buttons

```tsx
function EmptyProjectsList() {
  return (
    <div className="text-center py-12">
      <Empty 
        Icon={FolderPlusIcon}
        message="You haven't created any projects yet"
      />
      
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Your First Project
        </button>
      </div>
    </div>
  );
}
```

### Animated Empty State

```tsx
import { motion } from "framer-motion";

function AnimatedEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-12"
    >
      <Empty 
        Icon={CloudOffIcon}
        message="Connection lost. Please check your internet."
      />
    </motion.div>
  );
}
```

### Responsive Empty States

```tsx
function ResponsiveEmpty({ isMobile }: { isMobile: boolean }) {
  return (
    <div className={`py-8 ${isMobile ? 'px-4' : 'px-12'}`}>
      <Empty 
        Icon={isMobile ? SmartphoneIcon : MonitorIcon}
        message={
          isMobile 
            ? "Tap to add content" 
            : "Click anywhere to add your first item"
        }
      />
    </div>
  );
}
```

## Styling

The Empty component uses Tailwind CSS classes and can be styled through its container:

```tsx
<div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
  <Empty 
    Icon={StarIcon}
    message="No starred items"
  />
</div>
```

## Internationalization

The Empty component respects the locale context and will automatically translate the default message:

```tsx
// In different languages, the default message will be localized
<Empty /> // English: "No data available"
<Empty /> // Portuguese: "Nenhum dado disponível"
<Empty /> // Spanish: "No hay datos disponibles"
```

## Accessibility

- Uses semantic HTML structure
- Proper color contrast ratios
- Screen reader compatible
- Icon has appropriate alt text through Lucide React

## Common Use Cases

1. **Data Tables**: When no records match filters
2. **Search Results**: When queries return no matches
3. **Lists**: When collections are empty
4. **Dashboards**: When no widgets or data are configured
5. **File Browsers**: When folders contain no files
6. **Shopping Carts**: When no items have been added
7. **Notifications**: When no new notifications exist
8. **Messages**: When inbox or chat is empty

## Related Components

- **Skeleton**: For loading states
- **Progress**: For loading with progress indication
- **Alert**: For error states or important messages