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

| Prop                 | Type                                                                   | Default     | Description                                    |
| -------------------- | ---------------------------------------------------------------------- | ----------- | ---------------------------------------------- |
| `open`               | `boolean`                                                              | —           | Controlled open state                          |
| `commands`           | `CommandItemTypes[]`                                                   | —           | Array of commands to display                   |
| `onChangeVisibility` | `(next: boolean) => void`                                              | —           | Open/close handler                             |
| `bind`               | `string`                                                               | `"Mod + k"` | Global keyboard shortcut to open the palette   |
| `loading`            | `boolean`                                                              | `false`     | Show loading skeleton while commands load      |
| `emptyMessage`       | `Label`                                                                | —           | Message shown when no results match            |
| `footer`             | `React.ReactElement`                                                   | —           | Custom footer content                          |
| `filters`            | `React.ReactNode`                                                    | —           | Optional consumer-provided filter controls; the palette renders the content but does not filter commands. |
| `onChangeText`       | `(text: string) => void`                                               | —           | Search text change handler                     |
| `Preview`            | `React.FC<{ command: CommandItemTypes; text: string }>`                | —           | Optional preview panel for the active command; users can collapse it when provided. |
| `Icon`               | `React.FC<IconProps & { text: string; Default: React.FC<IconProps> }>` | —           | Custom search icon                             |
| `translations`       | `TranslationOverrides`                                                 | —           | Override the palette, filter, and preview accessibility labels. |

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
type CommandGroupItem = {
    type: "group";
    title: string | React.ReactElement | React.ComponentType<{ text: string }>;
    items: CommandItemTypes[];
};
```

## Design Tokens

Geometry defaults use scoped `calc()` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.

Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override | Library default |
| --- | --- |
| `--var-command-dialog-max-inline-size-md` | `calc(var(--var-spacing-base) * 40)` |
| `--var-command-dialog-max-inline-size-lg` | `calc(var(--var-spacing-base) * 48)` |
| `--var-command-list-max-block-size` | `calc(var(--var-spacing-base) * 24)` |
| `--var-command-row-block-size` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-command-group-padding-block-start` | `calc(var(--var-spacing-base) * 0.5)` |

With `Preview`, desktop palettes can grow to 94vw (capped at 96 spacing units) and use a side-by-side results/preview layout from 1024px. Narrower layouts stack the preview below the results.

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token                    | CSS Variable            | Purpose                                |
| ------------------------ | ----------------------- | -------------------------------------- |
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

Pass your own filter controls through `filters`. CommandPalette only renders and collapses this content; use your application state to decide which commands to pass. When `Preview` is provided, the palette shows a side panel for the active command and includes independent controls to hide the preview and filters.

```tsx
import { useState } from "react";
import { CommandPalette } from "@g4rcez/components";

function ProjectCommandPalette() {
    const [open, setOpen] = useState(false);
    const [projectsOnly, setProjectsOnly] = useState(false);
    const allCommands = [
        { type: "shortcut" as const, title: "Open project", category: "project", action: ({ setOpen }: { setOpen: (open: boolean) => void }) => setOpen(false) },
        { type: "shortcut" as const, title: "Open preferences", category: "settings", action: ({ setOpen }: { setOpen: (open: boolean) => void }) => setOpen(false) },
    ];
    const commands = projectsOnly ? allCommands.filter((command) => command.category === "project") : allCommands;

    return (
        <CommandPalette
            open={open}
            commands={commands}
            onChangeVisibility={setOpen}
            filters={
                <button type="button" aria-pressed={projectsOnly} onClick={() => setProjectsOnly((enabled) => !enabled)}>
                    Projects only
                </button>
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

Omitting `filters` leaves the filter row and its toggle out of the palette. The preview toggle is likewise available only when `Preview` is supplied.


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
    {
        type: "shortcut" as const,
        title: "User Dashboard",
        Icon: <UserIcon size={16} />,
        action: ({ setOpen }) => setOpen(false),
    },
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

- Use `hint` arrays to add synonyms so commands match varied search terms (e.g., `["preferences", "config"]` for a "Settings" command).
- Group related commands with `type: "group"` so users can scan results quickly.
- Provide a clear `emptyMessage` so users know when nothing matches.
- Keep command titles short; let `hint` carry the synonym load.

## Don't

- Don't put every action in the palette — focus on the most useful commands.
- Don't use raw utility color classes (`bg-blue-500`, `text-white`) in custom `Icon` or `Preview` components — use design-token classes instead.
- Don't pass arbitrary utility values (`bg-[#abc]`, `z-[9999]`) — override CSS variables in your `@theme` block.
- Don't omit the global shortcut — the default `Mod+K` is a strong convention users expect.

## Accessibility

- Full arrow-key navigation within the list with loop support.
- `Enter` executes the active command; `Escape` closes the palette.
- Each item renders with `role="option"` and `aria-selected` reflecting the active state.
- The palette is wrapped in a `Modal` with `ariaTitle="Command palette"` for screen readers.
- The search input receives `autoFocus` when the palette opens.
- Layout controls expose their expanded state and controlled region to assistive technology. The preview is a labelled region; consumer-provided filter controls retain their own semantics.

## Data Attributes

| Attribute                                          | Applied to             | Description                                      |
| -------------------------------------------------- | ---------------------- | ------------------------------------------------ |
| `data-component="command-palette"`                 | Root modal container   | Identifies the palette root                      |
| `data-has-preview="true"`                          | Root modal container   | Enables the wider preview layout                 |
| `data-component="command-palette-list"`            | List container         | Identifies the command list                      |
| `data-component="command-palette-item"`            | Each command option    | Identifies an individual command option          |
| `data-component="command-palette-container"`       | List/preview wrapper   | Identifies the content area                      |
| `data-component="command-palette-filters"`         | Filter content wrapper | Identifies the optional consumer-owned filters   |
| `data-component="command-palette-preview"`         | Preview `<section>`    | Identifies the active command preview region     |

## Notes

- The component registers global keyboard listeners via `CombiKeys`. All `shortcut` commands are also registered as global hotkeys — they fire even when the palette is closed.
- Fuzzy search runs over `title`, `shortcut`, and `hint` fields. When `title` is a function, it is called with the current search text to produce a string for matching.
- Commands with `enabled: false` (or a function returning `false`) are filtered out of results.
- When `Preview` is provided, the first visible shortcut is selected and previewed by default, including when search text is empty. Searching updates the preview to the first matching shortcut. The preview shows an instruction when no shortcut is available or commands are loading; its visibility is independent of the optional filter row.
- The palette is built on top of `Modal`, so it inherits modal accessibility and portal rendering.
