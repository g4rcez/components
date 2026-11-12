---
title: CommandPalette
description: Searchable command palette with fuzzy search, keyboard shortcuts, and grouped commands.
package: "@g4rcez/components"
export: "{ CommandPalette }"
import: "import { CommandPalette } from '@g4rcez/components'"
category: floating
---

# CommandPalette

Searchable command palette with fuzzy search, keyboard shortcuts, and grouped commands.

## Import

```tsx
import { CommandPalette } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state |
| `commands` | `CommandItemTypes[]` | — | Commands to display |
| `onChangeVisibility` | `(next: boolean) => void` | — | Open/close handler |
| `bind` | `string` | `"Mod + k"` | Global keyboard shortcut that opens the palette |
| `loading` | `boolean` | `false` | Show loading skeleton while commands load |
| `emptyMessage` | `Label` | — | Message shown when no results match |
| `footer` | `React.ReactElement` | — | Custom footer content |
| `filters` | `React.ReactNode` | — | Consumer filter controls. The palette renders them but does not filter commands. |
| `onChangeText` | `(text: string) => void` | — | Search text change handler |
| `Preview` | `React.FC<{ command: CommandItemTypes; text: string }>` | — | Preview panel for the active command. Users can collapse it. |
| `Icon` | `React.FC<IconProps & { text: string; Default: React.FC<IconProps> }>` | — | Custom search icon |
| `translations` | `TranslationOverrides` | — | Overrides palette, filter, and preview accessibility labels. |

## Command Types

### CommandShortcutItem

```tsx
type CommandShortcutItem = {
    type: "shortcut";
    title: string | React.ReactElement | React.ComponentType<{ text: string }>;
    hint?: string | string[];
    shortcut?: string;
    Icon?: React.ReactElement;
    enabled?: boolean | ((props: { text: string }) => boolean);
    action: (args: {
        text: string;
        setText: (state: string) => void;
        setOpen: (state: boolean) => void;
        event: KeyboardEvent | React.MouseEvent | React.KeyboardEvent;
    }) => void | Promise<void>;
};
```

### CommandGroupItem

```tsx
type CommandGroupItem = { type: "group"; title: string | React.ReactElement | React.ComponentType<{ text: string }>; items: CommandItemTypes[] };
```

## Design Tokens

Defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides take precedence. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The table shows examples; the exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-command-dialog-max-inline-size-md` | `calc(var(--var-spacing-base) * 40)` |
| `--var-command-dialog-max-inline-size-lg` | `calc(var(--var-spacing-base) * 48)` |
| `--var-command-list-max-block-size` | `calc(var(--var-spacing-base) * 24)` |
| `--var-command-row-block-size` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-command-group-padding-block-start` | `calc(var(--var-spacing-base) * 0.5)` |

With `Preview`, desktop palettes grow to 94vw, capped at 96 spacing units. From 1024px, results and preview show side by side. Narrower layouts stack the preview below the results.

Override these CSS variables in your theme to customize the component.

| Token | CSS Variable | Purpose |
|---|---|---|
| CSS override | `--var-command-surface-background` | Palette surface background |
| CSS override | `--var-command-surface-border` | Palette surface border |
| CSS override | `--var-command-item-background-hover` | Hovered/active command background |
| `z-floating` | `--var-layer-floating` | Search header z-index |
| CSS override | `--var-command-group-label-foreground` | Group label text |
| CSS override | `--var-command-empty-foreground` | Empty state text |

## Examples

### Basic Command Palette

```tsx
import { useState } from "react";
import { FileTextIcon, FloppyDiskIcon, FolderOpenIcon } from "@phosphor-icons/react";
import { CommandPalette } from "@g4rcez/components";
function BasicCommandPalette() {
    const [open, setOpen] = useState(false);
    const commands = [
        {
            type: "shortcut" as const,
            title: "New Document",
            shortcut: "Ctrl+N",
            Icon: <FileTextIcon size={16} />,
            action: ({ setOpen }) => {
                console.log("Creating new document");
                setOpen(false);
            },
        },
        {
            type: "shortcut" as const,
            title: "Save Document",
            shortcut: "Ctrl+S",
            Icon: <FloppyDiskIcon size={16} />,
            action: ({ setOpen }) => {
                console.log("Saving document");
                setOpen(false);
            },
        },
        {
            type: "shortcut" as const,
            title: "Open File",
            shortcut: "Ctrl+O",
            Icon: <FolderOpenIcon size={16} />,
            action: ({ setOpen }) => {
                console.log("Opening file");
                setOpen(false);
            },
        },
    ];
    return <CommandPalette open={open} commands={commands} onChangeVisibility={setOpen} />;
}
```

### Preview and consumer-provided filters

Pass filter controls through `filters`. CommandPalette only renders and collapses them. Application state decides which commands to pass. With `Preview`, the palette shows a side panel for the active command. Independent controls hide the preview and the filters. Without `filters`, the palette omits the filter row. The preview control appears only when `Preview` is set.

```tsx
import { useState } from "react";
import { Button } from "@g4rcez/components/button";
import { CommandPalette } from "@g4rcez/components";

function ProjectCommandPalette() {
    const [open, setOpen] = useState(false);
    const [projectsOnly, setProjectsOnly] = useState(false);
    const allCommands = [
        {
            type: "shortcut" as const,
            title: "Open project",
            category: "project",
            action: ({ setOpen }: { setOpen: (open: boolean) => void }) => setOpen(false),
        },
        {
            type: "shortcut" as const,
            title: "Open preferences",
            category: "settings",
            action: ({ setOpen }: { setOpen: (open: boolean) => void }) => setOpen(false),
        },
    ];
    const commands = projectsOnly ? allCommands.filter((command) => command.category === "project") : allCommands;

    return (
        <CommandPalette
            open={open}
            commands={commands}
            onChangeVisibility={setOpen}
            filters={
                <Button
                    type="button"
                    theme={projectsOnly ? "primary" : "ghost-neutral"}
                    aria-pressed={projectsOnly}
                    onClick={() => setProjectsOnly((enabled) => !enabled)}
                >
                    Projects only
                </Button>
            }
            Preview={({ command }) => (
                <article>
                    <h2>{typeof command.title === "string" ? command.title : "Command"}</h2>
                    <p>Render application-specific details for this command.</p>
                </article>
            )}
        />
    );
}
```

### Grouped Commands

```tsx
import { FileIcon, FolderOpenIcon, HouseIcon, GearIcon, MoonIcon } from "@phosphor-icons/react";
import { CommandPalette } from "@g4rcez/components";
function GroupedCommandPalette() {
    const [open, setOpen] = useState(false);
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
                    Icon: <FileIcon size={16} />,
                    action: ({ setOpen }) => setOpen(false),
                },
                {
                    type: "shortcut" as const,
                    title: "Open File",
                    hint: ["open", "load"],
                    shortcut: "Ctrl+O",
                    Icon: <FolderOpenIcon size={16} />,
                    action: ({ setOpen }) => setOpen(false),
                },
            ],
        },
        {
            type: "group" as const,
            title: "Navigation",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Go to Dashboard",
                    hint: ["dashboard", "home", "main"],
                    Icon: <HouseIcon size={16} />,
                    action: ({ setOpen }) => {
                        window.location.href = "/dashboard";
                        setOpen(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "Go to Settings",
                    hint: ["settings", "preferences", "config"],
                    Icon: <GearIcon size={16} />,
                    action: ({ setOpen }) => {
                        window.location.href = "/settings";
                        setOpen(false);
                    },
                },
            ],
        },
        {
            type: "group" as const,
            title: "Theme",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Toggle Dark Mode",
                    hint: ["dark", "theme", "mode"],
                    Icon: <MoonIcon size={16} />,
                    action: ({ setOpen }) => {
                        document.documentElement.classList.toggle("dark");
                        setOpen(false);
                    },
                },
            ],
        },
    ];
    return <CommandPalette open={open} commands={commands} onChangeVisibility={setOpen} emptyMessage="No commands found" />;
}
```

### Custom Keyboard Shortcut

```tsx
<CommandPalette open={open} commands={commands} onChangeVisibility={setOpen} bind="Mod + /" />
```

### Conditional Commands

```tsx
import { UserIcon, ShieldIcon } from "@phosphor-icons/react";
const commands = [
    { type: "shortcut" as const, title: "User Dashboard", Icon: <UserIcon size={16} />, action: ({ setOpen }) => setOpen(false) },
    {
        type: "shortcut" as const,
        title: "Admin Panel",
        enabled: user.isAdmin,
        Icon: <ShieldIcon size={16} />,
        action: ({ setOpen }) => {
            console.log("Opening admin panel");
            setOpen(false);
        },
    },
];
```

## Do

- Add synonyms in `hint` arrays, e.g. `["preferences", "config"]` for a "Settings" command.
- Group related commands with `type: "group"`.
- Set a clear `emptyMessage`.
- Keep command titles short. Let `hint` carry the synonyms.

## Don't

- Don't add every action. Include only the most useful commands.
- Don't use raw color utilities (`bg-blue-500`, `text-white`) in custom `Icon` or `Preview` components. Use design-token classes.
- Don't use arbitrary values (`bg-[#abc]`, `z-[9999]`). Override CSS variables in your `@theme` block.
- Don't omit the global shortcut. Users expect the default `Mod+K`.

## Accessibility

- Arrow keys navigate the list and loop.
- `Enter` runs the active command. `Escape` closes the palette.
- Each item has `role="option"`. `aria-selected` marks the active item.
- A `Modal` with `ariaTitle="Command palette"` wraps the palette.
- The search input gets `autoFocus` when the palette opens.
- Layout controls expose their expanded state and controlled region. The preview is a labelled region. Consumer filter controls keep their own semantics.

## Data Attributes

| Attribute | Applied to | Description |
|---|---|---|
| `data-component="command-palette"` | Palette wrapper inside the Modal body | Palette root |
| `data-has-preview="true"` | Palette wrapper inside the Modal body | Marks the preview layout (the wider dialog comes from the overlay `__command-palette__overlay--preview` class) |
| `data-component="command-palette-list"` | List container | Command list |
| `data-component="command-palette-item"` | Each command option | One command option |
| `data-component="command-palette-container"` | List/preview wrapper | Content area |
| `data-component="command-palette-filters"` | Filter content wrapper | Optional consumer-owned filters |
| `data-component="command-palette-preview"` | Preview `<section>` | Active command preview region |

## Notes

- `CombiKeys` registers global keyboard listeners. All `shortcut` commands also register as global hotkeys and fire when the palette is closed.
- Fuzzy search matches `title`, `shortcut`, and `hint`. When `title` is a function, the palette calls it with the search text to get a string.
- Commands with `enabled: false`, or an `enabled` function that returns `false`, do not appear in results.
- With `Preview`, the first visible shortcut is selected and previewed by default, including when search text is empty.
- Searching selects the first matching shortcut in the preview.
- The preview shows an instruction when no shortcut is available or commands are loading.
- Preview visibility is independent of the filter row.
- `Modal` is the base of the palette. The palette inherits modal accessibility and portal rendering.
