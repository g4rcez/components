"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { FilePyIcon, FileRsIcon, FileTsIcon } from "@phosphor-icons/react";
import { Card, Reactions, type Reaction, type ReactionOption } from "@g4rcez/components";
import { useState } from "react";

const options: ReactionOption[] = [
    { id: "ts", label: "TypeScript", icon: FileTsIcon },
    { id: "rust", label: "Rust", icon: FileRsIcon },
    { id: "python", label: "Python", icon: FilePyIcon },
    { id: "go", label: "Go", icon: "🐹" },
    { id: "ruby", label: "Ruby", icon: "💎" },
    { id: "java", label: "Java", icon: "☕" },
];

const initial: Reaction[] = [
    { id: "ts", count: 12, reacted: false },
    { id: "rust", count: 3, reacted: true },
    { id: "python", count: 1, reacted: false },
];

export default function ReactionsPage() {
    const [saved, setSaved] = useState<Reaction[]>(initial);
    const [log, setLog] = useState("No changes yet.");

    return (
        <DocsLayout
            title="Reactions"
            section="display"
            description="Vote on a post, comment or poll in one tap, with counts that roll digit by digit."
            useWhen="Use Reactions for lightweight voting and acknowledgement on comments, posts, polls and release notes. Persist changes in onValueChange and pass value back for server-backed counts."
            avoidWhen="Avoid it for replies, where a text field fits, for a single like or follow toggle, where ActionSwap fits, and for static counts that people cannot change, where a Tag fits."
            accessibility="The bar is a group and each pill is a toggle button named with its label, count and whether you reacted. The picker is a toolbar with roving tabindex: arrows wrap, Home and End jump, Escape closes it and returns focus to the Add reaction button. A polite status announces every change, and focus moves to a neighbour when the focused pill leaves."
        >
            <ComponentDemo
                title="Uncontrolled"
                description="Tap a pill to toggle your own reaction. The add button opens a picker with every option; a pill whose count reaches zero leaves the bar and the rest reflow on a spring."
                code={`"use client";
import { FileRsIcon, FileTsIcon } from "@phosphor-icons/react";
import { Reactions, type ReactionOption } from "@g4rcez/components";

const options: ReactionOption[] = [
  { id: "ts", label: "TypeScript", icon: FileTsIcon },
  { id: "rust", label: "Rust", icon: FileRsIcon },
  { id: "ruby", label: "Ruby", icon: "💎" },
];

function LanguagePoll() {
  return (
    <Reactions
      options={options}
      defaultValue={[
        { id: "ts", count: 12, reacted: false },
        { id: "rust", count: 3, reacted: true },
      ]}
    />
  );
}`}
            >
                <Card title="Icons, components and emoji">
                    <Reactions options={options} defaultValue={initial} />
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Controlled and persisted by the parent"
                description="onValueChange receives the next list and the change that produced it. Save it and pass value back, which is how you wire server-backed counts."
                onReset={() => {
                    setSaved(initial);
                    setLog("No changes yet.");
                }}
                code={`"use client";
import { useState } from "react";
import { Reactions, type Reaction } from "@g4rcez/components";

function ServerBacked() {
  const [value, setValue] = useState<Reaction[]>(initial);
  return (
    <Reactions
      options={options}
      value={value}
      onValueChange={(next, change) => {
        setValue(next);
        save(change); // { id: "ts", reacted: true }
      }}
    />
  );
}`}
            >
                <Card title="Language poll">
                    <div className="flex flex-col items-start gap-4">
                        <Reactions
                            options={options}
                            value={saved}
                            onValueChange={(next, change) => {
                                setSaved(next);
                                setLog(`${change.reacted ? "Added" : "Removed"} “${change.id}”`);
                            }}
                        />
                        <p className="text-muted-foreground text-sm" role="status">
                            {log}
                        </p>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
