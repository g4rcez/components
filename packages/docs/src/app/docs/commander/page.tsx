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
import { useState } from "react";
import { Button, CommandPalette } from "../../../../../lib/src";
import type { CommandItemTypes } from "../../../../../lib/src/components/floating/command-palette";
import { useNotification } from "../../../../../lib/src/components/display/notifications";

const CommandPreview: React.FC<{ command: CommandItemTypes; text: string }> = ({
  command,
}) => {
  return (
    <div className="w-64 border-l border-floating-border p-4 flex flex-col gap-3">
      {command.type === "group" ? (
        <p className="text-sm font-semibold text-foreground">
          {typeof command.title === "function"
            ? command.title({ text: "" })
            : command.title}
        </p>
      ) : (
        <>
          {command.Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {command.Icon}
            </div>
          )}
          <p className="text-sm font-semibold text-foreground">
            {typeof command.title === "function"
              ? command.title({ text: "" })
              : command.title}
          </p>
          {command.shortcut && (
            <span className="inline-flex w-fit items-center rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {command.shortcut}
            </span>
          )}
          {command.hint && (
            <p className="text-xs text-muted-foreground">
              {Array.isArray(command.hint)
                ? command.hint.join(" · ")
                : command.hint}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default function CommanderPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const notification = useNotification();

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
          <Button
            theme="primary"
            size="big"
            onClick={() => setOpen1(true)}
            className="shadow-xl shadow-primary/20"
          >
            Open Commander
          </Button>
          <p className="text-xs text-muted-foreground">
            Or press <span className="text-primary font-bold">Alt + K</span>
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
            Type <span className="text-primary font-bold">xyz</span> to see the
            empty state
          </p>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="With Preview Panel"
        description="Navigate commands with arrow keys to see a contextual preview panel on the right."
        code={`import { CommandPalette, Button } from "@g4rcez/components";
import type { CommandItemTypes } from "@g4rcez/components";
import { SquaresFourIcon, FolderIcon, GearIcon, MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import { useState } from "react";

const CommandPreview: React.FC<{ command: CommandItemTypes; text: string }> = ({ command }) => {
  if (command.type === "group") return <div className="w-64 p-4">{command.title}</div>;
  return (
    <div className="w-64 border-l border-floating-border p-4 flex flex-col gap-3">
      {command.Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {command.Icon}
        </div>
      )}
      <p className="text-sm font-semibold">{command.title}</p>
      {command.shortcut && (
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {command.shortcut}
        </span>
      )}
      {command.hint && <p className="text-xs text-muted-foreground">{command.hint}</p>}
    </div>
  );
};

function PreviewExample() {
  const [open, setOpen] = useState(false);

  const commands = [
    { type: "shortcut", title: "Dashboard", shortcut: "Alt+d", Icon: <SquaresFourIcon size={20} />, hint: "Navigate to your personal dashboard.", action: () => setOpen(false) },
    { type: "shortcut", title: "Projects",  shortcut: "Alt+p", Icon: <FolderIcon size={20} />,           hint: "Browse and manage all your projects.",  action: () => setOpen(false) },
    { type: "shortcut", title: "Settings",  shortcut: "Alt+s", Icon: <GearIcon size={20} />,         hint: "Configure your account preferences.",    action: () => setOpen(false) },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Commander</Button>
      <CommandPalette open={open} commands={commands} onChangeVisibility={setOpen} Preview={CommandPreview} />
    </>
  );
}`}
      >
        <div className="flex flex-col items-center gap-4">
          <Button onClick={() => setOpen3(true)}>Open Commander</Button>
          <p className="text-xs text-muted-foreground">
            Use <span className="text-primary font-bold">↑ ↓ arrow keys</span>{" "}
            to highlight a command and see the preview
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
        commands={previewCommands}
        onChangeVisibility={setOpen3}
      />
    </DocsLayout>
  );
}
