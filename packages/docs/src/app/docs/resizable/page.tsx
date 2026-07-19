"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Button, Card, Resizable } from "@g4rcez/components";

export default function ResizablePage() {
    const [showExtra, setShowExtra] = useState(false);
    const [items, setItems] = useState(["Item 1", "Item 2"]);

    return (
        <DocsLayout
            title="Resizable"
            section="primitives"
            description="Wraps content with a motion-animated height container that smoothly transitions when content height changes."
        >
            <ComponentDemo
                title="Toggle Content"
                description="The container animates its height when content is shown or hidden."
                code={`"use client";
import { useState } from "react";
import { Resizable } from "@g4rcez/components/core/resizable";

function ToggleContent() {
  const [showExtra, setShowExtra] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setShowExtra((v) => !v)}
        className="rounded px-4 py-2 bg-primary text-primary-foreground w-fit"
      >
        {showExtra ? "Hide" : "Show"} extra content
      </button>
      <Resizable>
        <div className="border border-card-border rounded p-4">
          <p>Always visible content</p>
          {showExtra && (
            <p className="mt-4 text-secondary">
              This extra content causes the container to grow smoothly.
            </p>
          )}
        </div>
      </Resizable>
    </div>
  );
}`}
            >
                <Card title="Toggle">
                    <div className="flex flex-col gap-4">
                        <button
                            type="button"
                            onClick={() => setShowExtra((v) => !v)}
                            className="w-fit rounded bg-primary px-4 py-2 text-primary-foreground"
                        >
                            {showExtra ? "Hide" : "Show"} extra content
                        </button>
                        <Resizable>
                            <div className="rounded border border-card-border p-4">
                                <p>Always visible content</p>
                                {showExtra && <p className="mt-4 text-secondary">This extra content causes the container to grow smoothly.</p>}
                            </div>
                        </Resizable>
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Growing List"
                description="Add items to a list and watch the container animate its height."
                code={`"use client";
import { useState } from "react";
import { Resizable } from "@g4rcez/components/core/resizable";

function GrowingList() {
  const [items, setItems] = useState(["Item 1", "Item 2"]);
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setItems((v) => [...v, \`Item \${v.length + 1}\`])}
        className="rounded px-4 py-2 bg-primary text-primary-foreground w-fit"
      >
        Add item
      </button>
      <Resizable>
        <ul className="border border-card-border rounded divide-y divide-card-border">
          {items.map((item) => (
            <li key={item} className="px-4 py-2">{item}</li>
          ))}
        </ul>
      </Resizable>
    </div>
  );
}`}
            >
                <Card title="Growing list">
                    <div className="flex flex-col gap-4">
                        <Button className="w-fit" onClick={() => setItems((v) => [...v, `Item ${v.length + 1}`])}>
                            Add item - {items.length}
                        </Button>
                        <Resizable>
                            <ul className="divide-y divide-card-border rounded border border-card-border">
                                {items.map((item) => (
                                    <li key={item} className="px-4 py-2">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Resizable>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
