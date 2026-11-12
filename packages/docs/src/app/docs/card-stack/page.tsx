"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { Card, CardStack } from "@g4rcez/components";
import { useState } from "react";

type Language = { id: string; name: string; paradigm: string; blurb: string; snippet: string; hue: number };

const languages: Language[] = [
    {
        id: "rust",
        name: "Rust",
        paradigm: "Systems",
        blurb: "Memory safety without a garbage collector.",
        snippet: 'fn main() {\n    println!("Hello");\n}',
        hue: 28,
    },
    {
        id: "go",
        name: "Go",
        paradigm: "Concurrent",
        blurb: "Small, fast to compile and built for servers.",
        snippet: 'func main() {\n    fmt.Println("Hello")\n}',
        hue: 200,
    },
    {
        id: "python",
        name: "Python",
        paradigm: "Scripting",
        blurb: "Readable by default, with a library for everything.",
        snippet: 'def main():\n    print("Hello")',
        hue: 50,
    },
    {
        id: "elixir",
        name: "Elixir",
        paradigm: "Functional",
        blurb: "Fault tolerant services on the Erlang VM.",
        snippet: "def hello do\n  :world\nend",
        hue: 280,
    },
];

const LanguageCard = ({ language }: { language: Language }) => (
    <div
        className="flex h-full flex-col justify-end gap-2 p-6"
        style={{ background: `linear-gradient(160deg, hsl(${language.hue} 55% 88%), hsl(${language.hue} 45% 74%))`, color: "hsl(0 0% 12%)" }}
    >
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">{language.paradigm}</p>
        <h3 className="text-2xl font-semibold">{language.name}</h3>
        <p className="text-sm opacity-90">{language.blurb}</p>
        <pre className="mt-2 overflow-hidden rounded-md p-3 font-mono text-xs" style={{ background: "hsl(0 0% 100% / 0.55)" }}>
            {language.snippet}
        </pre>
    </div>
);

export default function CardStackPage() {
    const [log, setLog] = useState("Decide a card to see it here.");

    return (
        <DocsLayout
            title="CardStack"
            section="display"
            description="Review a deck one card at a time by dragging, flicking, pressing a button or using the arrow keys, with undo."
            useWhen="Use CardStack for one-by-one triage: learning lists, review queues and onboarding picks, especially when a left or right decision should be undoable."
            avoidWhen="Avoid it when people need to compare items side by side, where a list or table fits, and for browsing without deciding, where a carousel fits. For quick actions on list rows use SwipeableList."
            accessibility="The stage is a focusable group described as a card stack, with a hint for the controls. Left and Right arrows decide the top card and Backspace, Cmd+Z or Ctrl+Z undo. The top card is labelled with its position, such as Rust, 1 of 4, and the cards beneath are hidden from assistive technology. Buttons offer every gesture, so swiping is never required, and decisions, undo and reset are announced politely. Touch swipes use touch-action pan-y, so vertical scrolling still works."
        >
            <ComponentDemo
                title="Language shortlist"
                description="Drag the top card, flick it, use the Skip and Learn buttons or the arrow keys while the stack is focused. Undo flies the last card back from the side it left. Only the top four cards render however long the deck is."
                onReset={() => setLog("Decide a card to see it here.")}
                code={`"use client";
import { CardStack } from "@g4rcez/components";

type Language = { id: string; name: string };

function Shortlist({ languages }: { languages: Language[] }) {
  return (
    <CardStack
      items={languages}
      getKey={(language) => language.id}
      getLabel={(language) => language.name}
      renderCard={(language) => <h3>{language.name}</h3>}
      labels={{ left: "Skip", right: "Learn" }}
      outcomes={{ left: "skipped", right: "queued" }}
      onDecide={(language, decision) => save(language.id, decision)}
    />
  );
}`}
            >
                <Card title="Language cards">
                    <div className="flex flex-col items-center gap-4">
                        <CardStack
                            items={languages}
                            getKey={(language) => language.id}
                            getLabel={(language) => language.name}
                            renderCard={(language) => <LanguageCard language={language} />}
                            labels={{ left: "Skip", right: "Learn" }}
                            outcomes={{ left: "skipped", right: "queued" }}
                            onDecide={(language, decision) => setLog(`${language.name} ${decision === "right" ? "queued" : "skipped"}`)}
                            onUndo={(language) => setLog(`${language.name} is back on top`)}
                            onReset={() => setLog("Deck restarted")}
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
