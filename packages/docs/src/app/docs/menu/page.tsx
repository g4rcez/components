"use client";
/* oxlint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props -- MenuItem sets tabIndex and aria-checked itself */
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React, { useState } from "react";
import { CodeIcon, FilePyIcon, FileRsIcon, FileTsIcon, PackageIcon } from "@phosphor-icons/react";
import { Button, Card, Menu, MenuItem, MenuLabel, MenuSeparator } from "@g4rcez/components";

const stage = "flex flex-wrap items-start gap-8 px-4 pt-6 pb-64";

const StackMenu = () => {
    const [frameworks, setFrameworks] = useState<string[]>(["react"]);
    const [runtime, setRuntime] = useState("node");
    const toggle = (id: string) => setFrameworks((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    return (
        <Menu asChild hover={false} label={<Button theme="muted">Project stack</Button>} title="Project stack">
            <MenuItem Left={FileTsIcon} title="TypeScript" shortcut="⌘1">
                TypeScript
            </MenuItem>
            <MenuItem Left={FileRsIcon} title="Rust" shortcut="⌘2">
                Rust
            </MenuItem>
            <MenuItem Left={FilePyIcon} title="Python" shortcut="⌘3">
                Python
            </MenuItem>
            <MenuItem Left={CodeIcon} title="Go" shortcut="⌘4">
                Go
            </MenuItem>
            <MenuSeparator />
            <MenuLabel>Frameworks</MenuLabel>
            <MenuItem role="menuitemcheckbox" checked={frameworks.includes("react")} onClick={() => toggle("react")} title="React">
                React
            </MenuItem>
            <MenuItem role="menuitemcheckbox" checked={frameworks.includes("vue")} onClick={() => toggle("vue")} title="Vue">
                Vue
            </MenuItem>
            <MenuSeparator />
            <MenuLabel>Runtime</MenuLabel>
            <MenuItem role="menuitemradio" checked={runtime === "node"} onClick={() => setRuntime("node")} title="Node.js">
                Node.js
            </MenuItem>
            <MenuItem role="menuitemradio" checked={runtime === "bun"} onClick={() => setRuntime("bun")} title="Bun">
                Bun
            </MenuItem>
            <MenuSeparator />
            <MenuItem Left={PackageIcon} tone="danger" title="Remove from stack">
                Remove from stack
            </MenuItem>
        </Menu>
    );
};

export default function MenuPage() {
    return (
        <DocsLayout title="Menu" section="floating" description="Create context menus, dropdowns, and nested navigation with ease.">
            <ComponentDemo
                title="Nested menus"
                description="A menu inside a menu opens to the right, at any depth. Here languages open their frameworks, and frameworks open their tools. Hover opens a level, and ArrowRight and ArrowLeft move between levels from the keyboard."
                code={`"use client";
import { Button, Menu, MenuItem } from "@g4rcez/components";

function Languages() {
  return (
    <Menu asChild label={<Button theme="muted">Languages</Button>} title="Languages">
      <Menu label="TypeScript">
        <Menu label="React">
          <MenuItem title="Next.js">Next.js</MenuItem>
          <MenuItem title="Remix">Remix</MenuItem>
          <MenuItem title="Vite">Vite</MenuItem>
        </Menu>
        <Menu label="Vue">
          <MenuItem title="Nuxt">Nuxt</MenuItem>
          <MenuItem title="Vite">Vite</MenuItem>
        </Menu>
        <MenuItem title="Angular">Angular</MenuItem>
      </Menu>
      <Menu label="Python">
        <MenuItem title="Django">Django</MenuItem>
        <MenuItem title="FastAPI">FastAPI</MenuItem>
        <MenuItem title="Flask">Flask</MenuItem>
      </Menu>
      <Menu label="Rust">
        <MenuItem title="Axum">Axum</MenuItem>
        <MenuItem title="Actix">Actix</MenuItem>
        <Menu label="Tauri">
          <MenuItem title="Tauri 2">Tauri 2</MenuItem>
          <MenuItem title="Tauri 1">Tauri 1</MenuItem>
        </Menu>
      </Menu>
      <MenuItem title="Go">Go</MenuItem>
    </Menu>
  );
}`}
            >
                <Card title="Languages and frameworks" className={stage}>
                    <Menu asChild label={<Button theme="muted">Languages</Button>} title="Languages">
                        <Menu label="TypeScript">
                            <Menu label="React">
                                <MenuItem title="Next.js">Next.js</MenuItem>
                                <MenuItem title="Remix">Remix</MenuItem>
                                <MenuItem title="Vite">Vite</MenuItem>
                            </Menu>
                            <Menu label="Vue">
                                <MenuItem title="Nuxt">Nuxt</MenuItem>
                                <MenuItem title="Vite">Vite</MenuItem>
                            </Menu>
                            <MenuItem title="Angular">Angular</MenuItem>
                        </Menu>
                        <Menu label="Python">
                            <MenuItem title="Django">Django</MenuItem>
                            <MenuItem title="FastAPI">FastAPI</MenuItem>
                            <MenuItem title="Flask">Flask</MenuItem>
                        </Menu>
                        <Menu label="Rust">
                            <MenuItem title="Axum">Axum</MenuItem>
                            <MenuItem title="Actix">Actix</MenuItem>
                            <Menu label="Tauri">
                                <MenuItem title="Tauri 2">Tauri 2</MenuItem>
                                <MenuItem title="Tauri 1">Tauri 1</MenuItem>
                            </Menu>
                        </Menu>
                        <MenuItem title="Go">Go</MenuItem>
                    </Menu>
                    <Menu asChild hover={false} label={<Button theme="muted">Languages, click only</Button>} title="Languages, click only">
                        <MenuItem title="TypeScript">TypeScript</MenuItem>
                        <MenuItem title="Rust">Rust</MenuItem>
                        <Menu label="Python">
                            <MenuItem title="Django">Django</MenuItem>
                            <MenuItem title="FastAPI">FastAPI</MenuItem>
                        </Menu>
                    </Menu>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Icons, shortcuts, groups and checks"
                description="Left puts an icon before the label and shortcut shows a key hint at the end of the row (display only, bind the keys yourself). MenuSeparator and MenuLabel group the rows, role menuitemcheckbox and menuitemradio with checked add the indicator column, and tone danger colors a destructive row."
                code={`"use client";
import { useState } from "react";
import { FilePyIcon, FileRsIcon, FileTsIcon, PackageIcon } from "@phosphor-icons/react";
import { Button, Menu, MenuItem, MenuLabel, MenuSeparator } from "@g4rcez/components";

function StackMenu() {
  const [react, setReact] = useState(true);
  const [runtime, setRuntime] = useState("node");
  return (
    <Menu asChild hover={false} label={<Button theme="muted">Project stack</Button>} title="Project stack">
      <MenuItem Left={FileTsIcon} title="TypeScript" shortcut="⌘1">TypeScript</MenuItem>
      <MenuItem Left={FileRsIcon} title="Rust" shortcut="⌘2">Rust</MenuItem>
      <MenuItem Left={FilePyIcon} title="Python" shortcut="⌘3">Python</MenuItem>
      <MenuSeparator />
      <MenuLabel>Frameworks</MenuLabel>
      <MenuItem role="menuitemcheckbox" checked={react} onClick={() => setReact((value) => !value)} title="React">React</MenuItem>
      <MenuSeparator />
      <MenuLabel>Runtime</MenuLabel>
      <MenuItem role="menuitemradio" checked={runtime === "node"} onClick={() => setRuntime("node")} title="Node.js">Node.js</MenuItem>
      <MenuItem role="menuitemradio" checked={runtime === "bun"} onClick={() => setRuntime("bun")} title="Bun">Bun</MenuItem>
      <MenuSeparator />
      <MenuItem Left={PackageIcon} tone="danger" title="Remove from stack">Remove from stack</MenuItem>
    </Menu>
  );
}`}
            >
                <Card title="Project stack" className={stage}>
                    <StackMenu />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Placement"
                description="Use side, align and offset to choose where the root menu opens. The defaults are side=bottom, align=start and offset=4. Nested menus always open to the right."
                code={`"use client";
import { Menu, MenuItem } from "@g4rcez/components";

function MenuPlacement() {
  return (
    <div className="flex gap-8">
      <Menu hover={false} label="Bottom, end" side="bottom" align="end">
        <MenuItem title="TypeScript">TypeScript</MenuItem>
        <MenuItem title="Rust">Rust</MenuItem>
      </Menu>
      <Menu hover={false} label="Right, start" side="right" align="start" offset={8}>
        <MenuItem title="TypeScript">TypeScript</MenuItem>
        <MenuItem title="Rust">Rust</MenuItem>
      </Menu>
    </div>
  );
}`}
            >
                <Card title="Placement" className={stage}>
                    <Menu hover={false} label="Bottom, end" side="bottom" align="end">
                        <MenuItem title="TypeScript">TypeScript</MenuItem>
                        <MenuItem title="Rust">Rust</MenuItem>
                    </Menu>
                    <Menu hover={false} label="Right, start" side="right" align="start" offset={8}>
                        <MenuItem title="TypeScript">TypeScript</MenuItem>
                        <MenuItem title="Rust">Rust</MenuItem>
                    </Menu>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Trigger and Item Styling"
                description="Use any component as the trigger with asChild, and style single rows with classes or with tone."
                code={`"use client";
import { Button, Card, Menu, MenuItem } from "@g4rcez/components";

function CustomMenuStyling() {
  return (
    <Card title="Custom component item">
      <Menu title="Release channel" label={<Button>Release channel</Button>} asChild>
        <MenuItem title="Perl" tone="danger">Perl · legacy</MenuItem>
        <MenuItem title="Rust" className="hover:bg-success hover:text-success-foreground focus:bg-success">Rust · stable</MenuItem>
        <MenuItem title="Zig" className="hover:bg-info hover:text-info-foreground focus:bg-info">Zig · beta</MenuItem>
      </Menu>
    </Card>
  );
}`}
            >
                <Card title="Custom component item" className={stage}>
                    <Menu title="Release channel" label={<Button>Release channel</Button>} asChild>
                        <MenuItem title="Perl" tone="danger">
                            Perl · legacy
                        </MenuItem>
                        <MenuItem title="Rust" className="hover:bg-success hover:text-success-foreground focus:bg-success">
                            Rust · stable
                        </MenuItem>
                        <MenuItem title="Zig" className="hover:bg-info hover:text-info-foreground focus:bg-info">
                            Zig · beta
                        </MenuItem>
                    </Menu>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
