"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card } from "../../../../../lib/src";
import { Shortcut } from "../../../../../lib/src/components/display/shortcut";

export default function ShortcutPage() {
    return (
        <DocsLayout
            title="Shortcut"
            section="display"
            description="Renders keyboard shortcut combinations as styled kbd elements with platform-aware modifier keys."
        >
            <ComponentDemo
                title="Simple Shortcuts"
                description="Single key or two-key combos rendered as keyboard badges."
                code={`import { Shortcut } from "@g4rcez/components/display/shortcut";

function SimpleShortcuts() {
  return (
    <div className="flex flex-wrap gap-4">
      <Shortcut value="Escape" />
      <Shortcut value="Enter" />
      <Shortcut value="Tab" />
      <Shortcut value="Ctrl+S" />
    </div>
  );
}`}
            >
                <Card title="Simple">
                    <div className="flex flex-wrap gap-4">
                        <Shortcut value="Escape" />
                        <Shortcut value="Enter" />
                        <Shortcut value="Tab" />
                        <Shortcut value="Ctrl+S" />
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Platform-Adaptive Modifiers"
                description="Mod renders as ⌘ on macOS and Ctrl on other platforms. Alt renders as ⌥ on macOS."
                code={`import { Shortcut } from "@g4rcez/components/display/shortcut";

function PlatformAdaptive() {
  return (
    <div className="flex flex-wrap gap-4">
      <Shortcut value="Mod+K" />
      <Shortcut value="Mod+Shift+P" />
      <Shortcut value="Alt+F4" />
    </div>
  );
}`}
            >
                <Card title="Platform-adaptive">
                    <div className="flex flex-wrap gap-4">
                        <Shortcut value="Mod+K" />
                        <Shortcut value="Mod+Shift+P" />
                        <Shortcut value="Alt+F4" />
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Shortcuts in Context"
                description="Shortcuts paired with their actions in a command list."
                code={`import { Shortcut } from "@g4rcez/components/display/shortcut";

function ShortcutsInContext() {
  const commands = [
    { label: "Open command palette", shortcut: "Mod+K" },
    { label: "Save document", shortcut: "Mod+S" },
    { label: "Find in file", shortcut: "Mod+F" },
    { label: "Close tab", shortcut: "Mod+W" },
  ];
  return (
    <ul className="flex flex-col divide-y divide-card-border">
      {commands.map((cmd) => (
        <li key={cmd.shortcut} className="flex items-center justify-between py-2">
          <span>{cmd.label}</span>
          <Shortcut value={cmd.shortcut} />
        </li>
      ))}
    </ul>
  );
}`}
            >
                <Card title="In context">
                    <ul className="flex flex-col divide-y divide-card-border">
                        {[
                            { label: "Open command palette", shortcut: "Mod+K" },
                            { label: "Save document", shortcut: "Mod+S" },
                            { label: "Find in file", shortcut: "Mod+F" },
                            { label: "Close tab", shortcut: "Mod+W" },
                        ].map((cmd) => (
                            <li key={cmd.shortcut} className="flex items-center justify-between py-2">
                                <span>{cmd.label}</span>
                                <Shortcut value={cmd.shortcut} />
                            </li>
                        ))}
                    </ul>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
