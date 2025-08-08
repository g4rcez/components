# CommandPalette Component

A powerful command palette with fuzzy search, keyboard shortcuts, and extensible command system. Perfect for creating searchable command interfaces with global keyboard shortcuts support.

## Import

```tsx
import { CommandPalette } from "@g4rcez/components/command-palette";
```

## Basic Usage

```tsx
import { useState } from "react";

function MyApp() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const commands = [
    {
      type: "shortcut" as const,
      title: "Create New File",
      shortcut: "Ctrl+N",
      Icon: <PlusIcon />,
      action: ({ setOpen }) => {
        console.log("Creating new file...");
        setOpen(false);
      }
    },
    {
      type: "shortcut" as const,
      title: "Open Settings",
      hint: ["settings", "preferences", "config"],
      Icon: <SettingsIcon />,
      action: ({ setOpen }) => {
        console.log("Opening settings...");
        setOpen(false);
      }
    }
  ];

  return (
    <>
      <button onClick={() => setPaletteOpen(true)}>
        Open Command Palette
      </button>
      
      <CommandPalette
        open={paletteOpen}
        commands={commands}
        onChangeVisibility={setPaletteOpen}
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `commands` | `CommandItemTypes[]` | - | Array of commands to display |
| `onChangeVisibility` | `(next: boolean) => void` | - | Open/close handler |
| `bind` | `string` | `"Mod + k"` | Global keyboard shortcut |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `emptyMessage` | `Label` | - | Empty state message |
| `footer` | `React.ReactElement` | - | Custom footer content |
| `onChangeText` | `(text: string) => void` | - | Search text change handler |
| `Preview` | `React.FC<{command, text}>` | - | Preview component |
| `Icon` | `React.FC<LucideProps>` | - | Custom search icon |

## Command Types

### Shortcut Commands

```tsx
type CommandShortcutItem = {
  type: "shortcut";
  title: View;                              // Command title (string or function)
  hint?: string | string[];                 // Search hints for better matching
  shortcut?: string;                        // Keyboard shortcut display
  Icon?: React.ReactElement;                // Command icon
  enabled?: boolean | ((props: ViewProps) => boolean); // Enable condition
  action: (args: {                          // Command action
    text: string;
    setOpen: (state: boolean) => void;
    event: Event;
  }) => void;
}
```

### Group Commands

```tsx
type CommandGroupItem = {
  type: "group";
  title: View;                              // Group title
  items: CommandItemTypes[];                // Nested commands
}
```

## Examples

### Basic Command Palette

```tsx
function BasicCommandPalette() {
  const [open, setOpen] = useState(false);

  const commands = [
    {
      type: "shortcut" as const,
      title: "New Document",
      shortcut: "Ctrl+N",
      Icon: <FileTextIcon className="w-4 h-4" />,
      action: ({ setOpen }) => {
        console.log("Creating new document");
        setOpen(false);
      }
    },
    {
      type: "shortcut" as const,
      title: "Save Document",
      shortcut: "Ctrl+S", 
      Icon: <SaveIcon className="w-4 h-4" />,
      action: ({ setOpen }) => {
        console.log("Saving document");
        setOpen(false);
      }
    },
    {
      type: "shortcut" as const,
      title: "Open File",
      shortcut: "Ctrl+O",
      Icon: <FolderOpenIcon className="w-4 h-4" />,
      action: ({ setOpen }) => {
        console.log("Opening file");
        setOpen(false);
      }
    }
  ];

  return (
    <CommandPalette
      open={open}
      commands={commands}
      onChangeVisibility={setOpen}
    />
  );
}
```

### Advanced Command Palette with Groups

```tsx
function AdvancedCommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const commands = [
    {
      type: "group" as const,
      title: "File Operations",
      items: [
        {
          type: "shortcut" as const,
          title: "New File",
          hint: ["create", "new", "file"],
          shortcut: "Ctrl+N",
          Icon: <FileIcon className="w-4 h-4" />,
          action: ({ setOpen }) => {
            console.log("New file");
            setOpen(false);
          }
        },
        {
          type: "shortcut" as const,
          title: "Open File",
          hint: ["open", "load"],
          shortcut: "Ctrl+O",
          Icon: <FolderOpenIcon className="w-4 h-4" />,
          action: ({ setOpen }) => {
            console.log("Open file");
            setOpen(false);
          }
        }
      ]
    },
    {
      type: "group" as const,
      title: "Navigation",
      items: [
        {
          type: "shortcut" as const,
          title: "Go to Dashboard",
          hint: ["dashboard", "home", "main"],
          Icon: <HomeIcon className="w-4 h-4" />,
          action: ({ setOpen }) => {
            window.location.href = "/dashboard";
            setOpen(false);
          }
        },
        {
          type: "shortcut" as const,
          title: "Go to Settings", 
          hint: ["settings", "preferences", "config"],
          Icon: <SettingsIcon className="w-4 h-4" />,
          action: ({ setOpen }) => {
            window.location.href = "/settings";
            setOpen(false);
          }
        }
      ]
    },
    {
      type: "group" as const,
      title: "Theme",
      items: [
        {
          type: "shortcut" as const,
          title: "Toggle Dark Mode",
          hint: ["dark", "theme", "mode"],
          Icon: <MoonIcon className="w-4 h-4" />,
          action: ({ setOpen }) => {
            document.documentElement.classList.toggle('dark');
            setOpen(false);
          }
        }
      ]
    }
  ];

  return (
    <CommandPalette
      open={open}
      commands={commands}
      onChangeVisibility={setOpen}
      onChangeText={setSearchText}
      emptyMessage="No commands found"
    />
  );
}
```

### Dynamic Commands with API Integration

```tsx
function APICommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dynamicCommands, setDynamicCommands] = useState<any[]>([]);

  // Static commands
  const staticCommands = [
    {
      type: "shortcut" as const,
      title: "Search Users",
      hint: ["users", "people", "contacts"],
      Icon: <UsersIcon className="w-4 h-4" />,
      action: () => console.log("Search users")
    }
  ];

  // Dynamic command search
  useEffect(() => {
    if (searchText.length > 2) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockResults = [
          {
            type: "shortcut" as const,
            title: `Open "${searchText}" Project`,
            Icon: <FolderIcon className="w-4 h-4" />,
            action: ({ setOpen }: any) => {
              console.log(`Opening ${searchText} project`);
              setOpen(false);
            }
          }
        ];
        
        setDynamicCommands(mockResults);
        setLoading(false);
      }, 300);
    } else {
      setDynamicCommands([]);
    }
  }, [searchText]);

  const allCommands = [...staticCommands, ...dynamicCommands];

  return (
    <CommandPalette
      open={open}
      commands={allCommands}
      onChangeVisibility={setOpen}
      onChangeText={setSearchText}
      loading={loading}
      emptyMessage="Type to search for projects..."
    />
  );
}
```

### Command Palette with Preview

```tsx
function CommandPaletteWithPreview() {
  const [open, setOpen] = useState(false);

  const PreviewComponent = ({ command, text }: any) => {
    if (command.type === "shortcut") {
      return (
        <div className="p-4 border-l bg-gray-50">
          <h3 className="font-semibold text-sm text-gray-900">
            {typeof command.title === 'string' ? command.title : 'Command'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {command.shortcut && `Shortcut: ${command.shortcut}`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Search query: "{text}"
          </p>
          {command.hint && (
            <div className="mt-2">
              <span className="text-xs text-gray-500">Also matches: </span>
              {Array.isArray(command.hint) 
                ? command.hint.join(', ')
                : command.hint
              }
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const commands = [
    {
      type: "shortcut" as const,
      title: "Create New Project",
      hint: ["project", "new", "create", "start"],
      shortcut: "Ctrl+Shift+N",
      Icon: <PlusIcon className="w-4 h-4" />,
      action: ({ setOpen }: any) => {
        console.log("Creating new project");
        setOpen(false);
      }
    }
  ];

  return (
    <CommandPalette
      open={open}
      commands={commands}
      onChangeVisibility={setOpen}
      Preview={PreviewComponent}
    />
  );
}
```

### Conditional Commands

```tsx
function ConditionalCommandPalette() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ isAdmin: false, isPro: true });

  const commands = [
    {
      type: "shortcut" as const,
      title: "User Dashboard",
      Icon: <UserIcon className="w-4 h-4" />,
      action: ({ setOpen }: any) => setOpen(false)
    },
    {
      type: "shortcut" as const,
      title: "Admin Panel",
      enabled: user.isAdmin,
      Icon: <ShieldIcon className="w-4 h-4" />,
      action: ({ setOpen }: any) => {
        console.log("Opening admin panel");
        setOpen(false);
      }
    },
    {
      type: "shortcut" as const,
      title: "Pro Features",
      enabled: user.isPro,
      Icon: <CrownIcon className="w-4 h-4" />,
      action: ({ setOpen }: any) => {
        console.log("Opening pro features");
        setOpen(false);
      }
    },
    {
      type: "shortcut" as const,
      title: "Upgrade to Pro",
      enabled: !user.isPro,
      Icon: <ZapIcon className="w-4 h-4" />,
      action: ({ setOpen }: any) => {
        console.log("Upgrade to pro");
        setOpen(false);
      }
    }
  ];

  return (
    <>
      <div className="space-y-2">
        <label>
          <input
            type="checkbox"
            checked={user.isAdmin}
            onChange={(e) => setUser(prev => ({ ...prev, isAdmin: e.target.checked }))}
          />
          Admin User
        </label>
        <label>
          <input
            type="checkbox"
            checked={user.isPro}
            onChange={(e) => setUser(prev => ({ ...prev, isPro: e.target.checked }))}
          />
          Pro User
        </label>
      </div>
      
      <CommandPalette
        open={open}
        commands={commands}
        onChangeVisibility={setOpen}
      />
      
      <button onClick={() => setOpen(true)}>
        Open Commands
      </button>
    </>
  );
}
```

### Command Palette with Footer

```tsx
function CommandPaletteWithFooter() {
  const [open, setOpen] = useState(false);

  const Footer = () => (
    <div className="border-t p-2 text-xs text-gray-500 bg-gray-50">
      <div className="flex justify-between">
        <span>↑↓ Navigate • ↵ Select • ⎋ Close</span>
        <span>Cmd+K to open</span>
      </div>
    </div>
  );

  const commands = [
    {
      type: "shortcut" as const,
      title: "Quick Action",
      Icon: <ZapIcon className="w-4 h-4" />,
      action: ({ setOpen }: any) => setOpen(false)
    }
  ];

  return (
    <CommandPalette
      open={open}
      commands={commands}
      onChangeVisibility={setOpen}
      footer={<Footer />}
    />
  );
}
```

## Global Keyboard Shortcuts

The CommandPalette automatically registers global keyboard shortcuts:

```tsx
// Default: Cmd/Ctrl + K
<CommandPalette
  open={open}
  commands={commands}
  onChangeVisibility={setOpen}
/>

// Custom shortcut
<CommandPalette
  open={open}
  commands={commands}
  onChangeVisibility={setOpen}
  bind="Mod + /"  // Cmd/Ctrl + /
/>
```

## Fuzzy Search

The command palette includes intelligent fuzzy search that matches:

- Command titles
- Search hints
- Keyboard shortcuts
- Partial matches and abbreviations

```tsx
const commands = [
  {
    type: "shortcut" as const,
    title: "Create New Document",
    hint: ["new", "doc", "create", "file"],
    shortcut: "Ctrl+N"
  }
];

// Matches searches like: "new", "doc", "cnd", "ctrl n", etc.
```

## Styling

The CommandPalette uses Tailwind CSS and can be customized through CSS classes:

```css
/* Custom command palette styling */
.command-palette-overlay {
  @apply bg-black/50 backdrop-blur-sm;
}

.command-palette-container {
  @apply bg-white border shadow-xl rounded-lg;
}

.command-item {
  @apply px-4 py-2 hover:bg-gray-100 cursor-pointer;
}
```

## Accessibility

- **Keyboard Navigation**: Full arrow key navigation
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Focus trapping within palette
- **Escape Handling**: ESC key closes palette
- **Announcements**: Screen reader announces results

## Performance

- **Fuzzy Search**: Optimized search algorithm
- **Virtualization**: Handles large command lists efficiently
- **Debounced Search**: Prevents excessive re-renders
- **Memory Efficient**: Proper cleanup of event listeners

## Related Components

- **Dropdown**: For simple dropdown menus
- **Modal**: For modal dialogs
- **Autocomplete**: For searchable form inputs