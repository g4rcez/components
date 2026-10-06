"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import {
    CodeIcon,
    FileTextIcon,
    FolderIcon,
    HouseIcon,
    SquaresFourIcon,
    SignOutIcon,
    PlayIcon,
    MagnifyingGlassIcon,
    GearIcon,
    TerminalIcon,
} from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import { type CommandItemTypes, useNotification, Button, CommandPalette } from "@g4rcez/components";

const previewRows = [
    { title: "Command palette", status: "In progress" },
    { title: "Project filters", status: "In review" },
    { title: "Keyboard shortcuts", status: "Ready" },
] as const;

const CommandPreview: React.FC<{ command: CommandItemTypes; text: string }> = ({ command, text }) => {
    if (command.type !== "shortcut") return null;

    const Title = command.title;
    const title = typeof Title === "function" ? <Title text={text} /> : Title;
    const hint = Array.isArray(command.hint) ? command.hint.join(" · ") : command.hint;

    return (
        <article className="flex min-w-0 flex-col gap-base">
            <div className="flex min-h-24 items-end justify-between gap-base overflow-hidden rounded-card-radius bg-muted p-base">
                <div className="min-w-0">
                    <p className="text-typography-xs font-semibold text-foreground">Workspace</p>
                    <p className="mt-1 text-typography-sm text-foreground/80">A page in your team space</p>
                </div>
                <FolderIcon aria-hidden="true" className="shrink-0 text-primary/20" size={64} />
            </div>
            <header className="flex min-w-0 items-start gap-sm">
                <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                    {command.Icon ?? <FolderIcon size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-typography-xs font-medium text-muted-foreground">Workspace page</p>
                    <h2 className="mt-1 break-words text-typography-xl font-semibold text-foreground">{title}</h2>
                </div>
                {command.shortcut ? (
                    <kbd className="inline-flex shrink-0 items-center rounded-tag-radius bg-muted px-tag-padding-x py-tag-padding-y font-mono text-typography-xs text-muted-foreground">
                        {command.shortcut}
                    </kbd>
                ) : null}
            </header>
            {hint ? <p className="text-typography-sm leading-relaxed text-muted-foreground">{hint}</p> : null}
            <section
                aria-label="Recently updated workspace pages"
                className="min-w-0 overflow-hidden rounded-card-radius border border-floating-border bg-floating-background"
            >
                <div className="flex items-center justify-between gap-sm border-b border-floating-border px-base py-sm">
                    <h3 className="text-typography-sm font-semibold text-foreground">Recent work</h3>
                    <span className="text-typography-xs text-muted-foreground">Example data</span>
                </div>
                <table className="w-full table-fixed border-collapse text-left text-typography-xs">
                    <caption className="sr-only">Example workspace pages and their status</caption>
                    <thead>
                        <tr className="border-b border-floating-border text-muted-foreground">
                            <th scope="col" className="w-2/3 px-base py-sm font-medium">
                                Page
                            </th>
                            <th scope="col" className="px-base py-sm font-medium">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {previewRows.map((row) => (
                            <tr className="border-b border-floating-border last:border-0" key={row.title}>
                                <td className="truncate px-base py-sm font-medium text-foreground">{row.title}</td>
                                <td className="px-base py-sm">
                                    <span className="inline-flex max-w-full truncate rounded-tag-radius bg-muted px-tag-padding-x py-tag-padding-y text-foreground">
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </article>
    );
};

export default function CommanderPage() {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const notification = useNotification();
    const [projectsOnly, setProjectsOnly] = useState(false);

    const allCommands = [
        {
            type: "group" as const,
            title: "Navigation",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Dashboard",
                    shortcut: "Alt+d",
                    Icon: <SquaresFourIcon size={16} />,
                    action: () => {
                        notification("Navigating to Dashboard...", { theme: "info" });
                        setOpen1(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "Projects",
                    shortcut: "Alt+p",
                    Icon: <FolderIcon size={16} />,
                    action: () => {
                        notification("Navigating to Projects...", { theme: "info" });
                        setOpen1(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "Settings",
                    shortcut: "Alt+s",
                    Icon: <GearIcon size={16} />,
                    action: () => {
                        notification("Opening Settings...", { theme: "info" });
                        setOpen1(false);
                    },
                },
            ],
        },
        {
            type: "group" as const,
            title: "Developer",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Console",
                    shortcut: "Alt+t",
                    Icon: <TerminalIcon size={16} />,
                    action: () => {
                        notification("Opening Console...", { theme: "success" });
                        setOpen1(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "Logs",
                    shortcut: "Alt+g",
                    Icon: <FileTextIcon size={16} />,
                    action: () => {
                        notification("Opening Logs...", { theme: "info" });
                        setOpen1(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "API Playground",
                    shortcut: "Alt+a",
                    Icon: <PlayIcon size={16} />,
                    action: () => {
                        notification("Opening API Playground...", { theme: "info" });
                        setOpen1(false);
                    },
                },
            ],
        },
        {
            type: "group" as const,
            title: "General",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Go to Home",
                    shortcut: "Alt+h",
                    Icon: <HouseIcon size={16} />,
                    action: () => {
                        notification("Navigating to Home...", { theme: "info" });
                        setOpen1(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "Quick Search",
                    shortcut: "Alt+f",
                    Icon: <MagnifyingGlassIcon size={16} />,
                    action: () => {
                        notification("Opening global search...", { theme: "info" });
                        setOpen1(false);
                    },
                },
            ],
        },
        {
            type: "group" as const,
            title: "System",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Open Terminal",
                    shortcut: "Alt+e",
                    Icon: <TerminalIcon size={16} />,
                    action: () => {
                        notification("Terminal access granted", { theme: "success" });
                        setOpen1(false);
                    },
                },
                {
                    type: "shortcut" as const,
                    title: "Open Code Editor",
                    shortcut: "Alt+c",
                    Icon: <CodeIcon size={16} />,
                    action: () => {
                        notification("Opening code editor...", { theme: "info" });
                        setOpen1(false);
                    },
                },
            ],
        },
        {
            type: "group" as const,
            title: "Account",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Logout",
                    shortcut: "Alt+l",
                    Icon: <SignOutIcon size={16} className="text-danger" />,
                    action: () => {
                        notification("Logging out...", { theme: "warn" });
                        setOpen1(false);
                    },
                },
            ],
        },
    ];

    const limitedCommands = [
        {
            type: "group" as const,
            title: "General",
            items: [
                {
                    type: "shortcut" as const,
                    title: "Go to Home",
                    shortcut: "Alt+h",
                    Icon: <HouseIcon size={16} />,
                    action: () => setOpen2(false),
                },
                {
                    type: "shortcut" as const,
                    title: "Quick Search",
                    shortcut: "Alt+f",
                    Icon: <MagnifyingGlassIcon size={16} />,
                    action: () => setOpen2(false),
                },
            ],
        },
    ];

    const previewCommands = [
        {
            type: "shortcut" as const,
            title: "Dashboard",
            shortcut: "Alt+d",
            Icon: <SquaresFourIcon size={20} />,
            hint: "Navigate to your personal dashboard with widgets and activity feeds.",
            action: () => setOpen3(false),
        },
        {
            type: "shortcut" as const,
            title: "Projects",
            shortcut: "Alt+p",
            Icon: <FolderIcon size={20} />,
            hint: "Browse and manage all your projects in one place.",
            action: () => setOpen3(false),
        },
        {
            type: "shortcut" as const,
            title: "Settings",
            shortcut: "Alt+s",
            Icon: <GearIcon size={20} />,
            hint: "Configure your account preferences, integrations, and notifications.",
            action: () => setOpen3(false),
        },
        {
            type: "shortcut" as const,
            title: "Quick Search",
            shortcut: "Alt+f",
            Icon: <MagnifyingGlassIcon size={20} />,
            hint: "Instantly search across files, people, and recent activity.",
            action: () => setOpen3(false),
        },
        {
            type: "shortcut" as const,
            title: "Logout",
            shortcut: "Alt+l",
            Icon: <SignOutIcon size={20} className="text-danger" />,
            hint: "Sign out of your account and end the current session.",
            action: () => setOpen3(false),
        },
    ];
    const visiblePreviewCommands = projectsOnly
        ? previewCommands.filter((command) => command.type === "shortcut" && command.title === "Projects")
        : previewCommands;

    return (
        <DocsLayout
            title="Commander"
            section="Floating Elements"
            description="A spotlight-style command palette with fuzzy search, grouped commands, and keyboard-driven navigation. Press Alt+K from anywhere to invoke it."
        >
            <ComponentDemo
                title="Basic Usage"
                description="Fuzzy search across multiple command groups. Try searching for 'log', 'play', or 'term' — or press Alt+K anywhere on this page."
                code={`import { CommandPalette, Button } from "@g4rcez/components";
import {
  SquaresFourIcon, FolderIcon, GearIcon,
  TerminalIcon, FileTextIcon, PlayIcon,
  HouseIcon, MagnifyingGlassIcon, SignOutIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

function CommanderExample() {
  const [open, setOpen] = useState(false);

  const commands = [
    {
      type: "group",
      title: "Navigation",
      items: [
        { type: "shortcut", title: "Dashboard", shortcut: "Alt+d", Icon: <SquaresFourIcon size={16} />, action: () => setOpen(false) },
        { type: "shortcut", title: "Projects",  shortcut: "Alt+p", Icon: <FolderIcon size={16} />,           action: () => setOpen(false) },
        { type: "shortcut", title: "Settings",  shortcut: "Alt+s", Icon: <GearIcon size={16} />,         action: () => setOpen(false) },
      ],
    },
    {
      type: "group",
      title: "Developer",
      items: [
        { type: "shortcut", title: "Console",        shortcut: "Alt+t", Icon: <TerminalIcon size={16} />,  action: () => setOpen(false) },
        { type: "shortcut", title: "Logs",           shortcut: "Alt+g", Icon: <FileTextIcon size={16} />, action: () => setOpen(false) },
        { type: "shortcut", title: "API Playground", shortcut: "Alt+a", Icon: <PlayIcon size={16} />,      action: () => setOpen(false) },
      ],
    },
    {
      type: "group",
      title: "Account",
      items: [
        { type: "shortcut", title: "Logout", shortcut: "Alt+l", Icon: <SignOutIcon size={16} />, action: () => setOpen(false) },
      ],
    },
  ];

  return (
    <>
      <Button theme="primary" onClick={() => setOpen(true)}>Open Commander</Button>
      <CommandPalette open={open} bind="Alt+k" commands={commands} onChangeVisibility={setOpen} />
    </>
  );
}`}
            >
                <div className="flex flex-col items-center gap-4">
                    <Button theme="primary" size="big" onClick={() => setOpen1(true)}>
                        Open Commander
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Or press <span className="font-bold text-primary">Alt + K</span>
                    </p>
                </div>
            </ComponentDemo>

            <ComponentDemo
                title="With Empty State"
                description="When a search query matches nothing, a custom empty message is displayed. Try opening the palette and typing something like 'xyz'."
                code={`import { CommandPalette, Button } from "@g4rcez/components";
import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useState } from "react";

function EmptyStateExample() {
  const [open, setOpen] = useState(false);

  const commands = [
    {
      type: "group",
      title: "General",
      items: [
        { type: "shortcut", title: "Go to Home",   shortcut: "Alt+h", Icon: <HouseIcon size={16} />,   action: () => setOpen(false) },
        { type: "shortcut", title: "Quick Search", shortcut: "Alt+f", Icon: <MagnifyingGlassIcon size={16} />, action: () => setOpen(false) },
      ],
    },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Commander</Button>
      <CommandPalette
        open={open}
        commands={commands}
        onChangeVisibility={setOpen}
        emptyMessage="No commands match your search. Try a different term."
      />
    </>
  );
}`}
            >
                <div className="flex flex-col items-center gap-4">
                    <Button onClick={() => setOpen2(true)}>Open Commander</Button>
                    <p className="text-xs text-muted-foreground">
                        Type <span className="font-bold text-primary">xyz</span> to see the empty state
                    </p>
                </div>
            </ComponentDemo>

            <ComponentDemo
                title="With Preview Panel"
                description="The first available command appears in the page preview on open. Use the arrow keys to explore its cover, details, and database; the Projects filter is consumer-owned."
                code={`import { CommandPalette, Button } from "@g4rcez/components";
import type React from "react";
import type { CommandItemTypes } from "@g4rcez/components";
import { SquaresFourIcon, FolderIcon, GearIcon } from "@phosphor-icons/react";
import { useState } from "react";

const previewRows = [
  { title: "Command palette", status: "In progress" },
  { title: "Project filters", status: "In review" },
  { title: "Keyboard shortcuts", status: "Ready" },
] as const;

const CommandPreview: React.FC<{ command: CommandItemTypes; text: string }> = ({ command, text }) => {
  if (command.type !== "shortcut") return null;
  const Title = command.title;
  const title = typeof Title === "function" ? <Title text={text} /> : Title;
  const hint = Array.isArray(command.hint) ? command.hint.join(" · ") : command.hint;

  return (
    <article className="flex min-w-0 flex-col gap-base">
      <div className="flex min-h-24 items-end justify-between gap-base overflow-hidden rounded-card-radius bg-muted p-base">
        <div className="min-w-0">
          <p className="text-typography-xs font-semibold text-foreground">Workspace</p>
          <p className="mt-1 text-typography-sm text-foreground/80">A page in your team space</p>
        </div>
        <FolderIcon aria-hidden="true" className="shrink-0 text-primary/20" size={64} />
      </div>
      <header className="flex min-w-0 items-start gap-sm">
        <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {command.Icon ?? <FolderIcon size={20} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-typography-xs font-medium text-muted-foreground">Workspace page</p>
          <h2 className="mt-1 break-words text-typography-xl font-semibold text-foreground">{title}</h2>
        </div>
        {command.shortcut && (
          <kbd className="inline-flex shrink-0 items-center rounded-tag-radius bg-muted px-tag-padding-x py-tag-padding-y font-mono text-typography-xs text-muted-foreground">
            {command.shortcut}
          </kbd>
        )}
      </header>
      {hint && <p className="text-typography-sm leading-relaxed text-muted-foreground">{hint}</p>}
      <section aria-label="Recently updated workspace pages" className="min-w-0 overflow-hidden rounded-card-radius border border-floating-border bg-floating-background">
        <div className="flex items-center justify-between gap-sm border-b border-floating-border px-base py-sm">
          <h3 className="text-typography-sm font-semibold text-foreground">Recent work</h3>
          <span className="text-typography-xs text-muted-foreground">Example data</span>
        </div>
        <table className="w-full table-fixed border-collapse text-left text-typography-xs">
          <caption className="sr-only">Example workspace pages and their status</caption>
          <thead>
            <tr className="border-b border-floating-border text-muted-foreground">
              <th scope="col" className="w-2/3 px-base py-sm font-medium">Page</th>
              <th scope="col" className="px-base py-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row) => (
              <tr className="border-b border-floating-border last:border-0" key={row.title}>
                <td className="truncate px-base py-sm font-medium text-foreground">{row.title}</td>
                <td className="px-base py-sm">
                  <span className="inline-flex max-w-full truncate rounded-tag-radius bg-muted px-tag-padding-x py-tag-padding-y text-foreground">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
};

function PreviewExample() {
  const [open, setOpen] = useState(false);
  const [projectsOnly, setProjectsOnly] = useState(false);
  const allCommands: CommandItemTypes[] = [
    { type: "shortcut", title: "Dashboard", shortcut: "Alt+d", Icon: <SquaresFourIcon size={20} />, hint: "Navigate to your personal dashboard.", action: () => setOpen(false) },
    { type: "shortcut", title: "Projects", shortcut: "Alt+p", Icon: <FolderIcon size={20} />, hint: "Browse and manage your projects.", action: () => setOpen(false) },
    { type: "shortcut", title: "Settings", shortcut: "Alt+s", Icon: <GearIcon size={20} />, hint: "Configure your account preferences.", action: () => setOpen(false) },
  ];
  const commands = projectsOnly ? allCommands.filter((command) => command.type === "shortcut" && command.title === "Projects") : allCommands;

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Commander</Button>
      <CommandPalette
        open={open}
        commands={commands}
        onChangeVisibility={setOpen}
        filters={
          <button
            type="button"
            aria-pressed={projectsOnly}
            className={\`rounded border border-floating-border px-3 py-1.5 text-sm \${projectsOnly ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}\`}
            onClick={() => setProjectsOnly((enabled) => !enabled)}
          >
            Projects only
          </button>
        }
        Preview={CommandPreview}
      />
    </>
  );
}`}
            >
                <div className="flex flex-col items-center gap-4">
                    <Button onClick={() => setOpen3(true)}>Open Commander</Button>
                    <p className="text-xs text-muted-foreground">
                        Use <span className="font-bold text-primary">↑ ↓ arrow keys</span> to update the preview, or use the collapsible Projects filter.
                    </p>
                </div>
            </ComponentDemo>
            <CommandPalette
                bind="Alt+k"
                open={open1}
                Icon={TerminalIcon}
                commands={allCommands}
                onChangeVisibility={setOpen1}
                emptyMessage="No commands found for your search."
            />
            <CommandPalette
                open={open2}
                commands={limitedCommands}
                onChangeVisibility={setOpen2}
                emptyMessage="No commands match your search. Try a different term."
            />
            <CommandPalette
                open={open3}
                Preview={CommandPreview}
                filters={
                    <button
                        type="button"
                        aria-pressed={projectsOnly}
                        className={`rounded border border-floating-border px-3 py-1.5 text-sm ${projectsOnly ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                        onClick={() => setProjectsOnly((enabled) => !enabled)}
                    >
                        Projects only
                    </button>
                }
                commands={visiblePreviewCommands}
                onChangeVisibility={setOpen3}
            />
        </DocsLayout>
    );
}
