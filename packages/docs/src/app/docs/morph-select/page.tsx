"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { CodeIcon, FilePyIcon, FileRsIcon, FileTsIcon } from "@phosphor-icons/react";
import { Card, MorphSelect, type MorphSelectItem } from "@g4rcez/components";
import { useState } from "react";

const languages: MorphSelectItem[] = [
    { value: "rust", label: "Rust", icon: <FileRsIcon aria-hidden /> },
    { value: "go", label: "Go", icon: <CodeIcon aria-hidden /> },
    { value: "typescript", label: "TypeScript", icon: <FileTsIcon aria-hidden /> },
    { value: "coffeescript", label: "CoffeeScript", icon: <CodeIcon aria-hidden />, disabled: true, meta: "legacy" },
    { value: "python", label: "Python", icon: <FilePyIcon aria-hidden /> },
    { value: "zig", label: "Zig", icon: <CodeIcon aria-hidden /> },
];

const paradigms: MorphSelectItem[] = [
    {
        label: "Systems",
        options: [
            { value: "rust", label: "Rust", meta: "2010", keywords: ["borrow checker", "cargo", "ownership"] },
            { value: "c", label: "C", meta: "1972", keywords: ["pointers", "kernel"] },
            { value: "cpp", label: "C++", meta: "1985", keywords: ["templates", "stl"] },
            { value: "zig", label: "Zig", meta: "2016", keywords: ["comptime", "allocator"] },
        ],
    },
    {
        label: "Scripting",
        options: [
            { value: "python", label: "Python", meta: "1991", keywords: ["pip", "notebook"] },
            { value: "ruby", label: "Ruby", meta: "1995", keywords: ["rails", "gem"] },
            { value: "lua", label: "Lua", meta: "1993", keywords: ["embedded", "neovim"] },
            { value: "javascript", label: "JavaScript", meta: "1995", keywords: ["node", "browser"] },
        ],
    },
    {
        label: "Functional",
        options: [
            { value: "haskell", label: "Haskell", meta: "1990", keywords: ["monad", "lazy"] },
            { value: "elixir", label: "Elixir", meta: "2011", keywords: ["beam", "erlang", "otp"] },
            { value: "ocaml", label: "OCaml", meta: "1996", keywords: ["ml", "algebraic types"] },
        ],
    },
];

const packageManagers: MorphSelectItem[] = [
    { value: "npm", label: "npm" },
    { value: "pnpm", label: "pnpm" },
    { value: "yarn", label: "Yarn" },
    { value: "bun", label: "Bun" },
    { value: "deno", label: "Deno" },
];

const runtimes: MorphSelectItem[] = [
    { value: "node", label: "Node.js" },
    { value: "deno", label: "Deno" },
    { value: "bun", label: "Bun" },
];

export default function MorphSelectPage() {
    const [picked, setPicked] = useState<string | null>("typescript");
    const [submitted, setSubmitted] = useState("Nothing submitted yet.");

    return (
        <DocsLayout
            title="MorphSelect"
            section="form"
            description="A select whose trigger grows into the list, with a gliding highlight, type-ahead, grouping and search."
            useWhen="Use MorphSelect for compact pickers and form fields with up to a few hundred options, such as a language, a runtime or a package manager, with or without icons, groups and trailing meta text."
            avoidWhen="Avoid it for mostly free-text entry or very long remote lists, where Autocomplete fits, for choosing several values, where MultiSelect fits, and for actions rather than stored values, where Menu fits."
            accessibility="The trigger is a combobox with aria-haspopup, aria-expanded and aria-activedescendant; with search on, the search input becomes the combobox. Options are listbox options and groups are labelled. Arrows, PageUp/PageDown (eight at a time), Home, End, type-ahead, Enter or Space to pick, Alt+ArrowUp to pick and close, Escape to close and Tab to leave without picking. A polite status announces the result count or No matches."
        >
            <ComponentDemo
                title="Language picker"
                description="Press the trigger, or focus it and press Enter, Space or an arrow key. Disabled options are skipped by the keyboard, and the value rolls up or down depending on where the new option sits in the list."
                onReset={() => setPicked("typescript")}
                code={`"use client";
import { useState } from "react";
import { FileRsIcon, FileTsIcon } from "@phosphor-icons/react";
import { MorphSelect, type MorphSelectItem } from "@g4rcez/components";

const items: MorphSelectItem[] = [
  { value: "rust", label: "Rust", icon: <FileRsIcon aria-hidden /> },
  { value: "coffeescript", label: "CoffeeScript", disabled: true, meta: "legacy" },
  { value: "typescript", label: "TypeScript", icon: <FileTsIcon aria-hidden /> },
];

function LanguagePicker() {
  const [value, setValue] = useState<string | null>("rust");
  return <MorphSelect label="Language" items={items} value={value} onValueChange={setValue} />;
}`}
            >
                <Card title="Controlled">
                    <div className="flex flex-col items-start gap-4">
                        <MorphSelect label="Language" items={languages} value={picked} onValueChange={setPicked} />
                        <p className="text-muted-foreground text-sm" role="status">
                            Value: {picked ?? "none"}
                        </p>
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Grouped options with search"
                description="Groups keep their headings and empty ones disappear while searching. Search turns on automatically above eight options and matches the label, the meta text (here the release year) and keywords, ignoring case and accents. Use align end near the right edge so the surface grows leftward."
                code={`"use client";
import { MorphSelect, type MorphSelectItem } from "@g4rcez/components";

const paradigms: MorphSelectItem[] = [
  {
    label: "Systems",
    options: [{ value: "rust", label: "Rust", meta: "2010", keywords: ["borrow checker", "cargo"] }],
  },
  {
    label: "Functional",
    options: [{ value: "elixir", label: "Elixir", meta: "2011", keywords: ["beam", "erlang"] }],
  },
];

function LanguageByParadigm() {
  return <MorphSelect label="Language" items={paradigms} placeholder="Choose a language" searchPlaceholder="Search languages" />;
}`}
            >
                <Card title="Languages by paradigm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <MorphSelect label="Language" items={paradigms} placeholder="Choose a language" searchPlaceholder="Search languages" />
                        <MorphSelect label="Package manager" items={packageManagers} defaultValue="pnpm" align="end" />
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Native form submission"
                description="Pass name and the value submits with the form, through a hidden input."
                code={`"use client";
import { MorphSelect } from "@g4rcez/components";

function ProjectForm() {
  return (
    <form onSubmit={(event) => { event.preventDefault(); save(new FormData(event.currentTarget)); }}>
      <MorphSelect label="Runtime" name="runtime" items={runtimes} defaultValue="node" />
      <button type="submit">Save</button>
    </form>
  );
}`}
            >
                <Card title="Form field">
                    <form
                        className="flex flex-col items-start gap-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            setSubmitted(`runtime = ${String(new FormData(event.currentTarget).get("runtime"))}`);
                        }}
                    >
                        <MorphSelect label="Runtime" name="runtime" items={runtimes} defaultValue="node" />
                        <button type="submit" className="docs-reset-button">
                            Save
                        </button>
                        <p className="text-muted-foreground text-sm" role="status">
                            {submitted}
                        </p>
                    </form>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
