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
import { Button, Resizable } from "@g4rcez/components";

function ToggleContent() {
  const [showExtra, setShowExtra] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Button type="button" onClick={() => setShowExtra((v) => !v)}>
        {showExtra ? "Hide" : "Show"} extra content
      </Button>
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
                        <Button type="button" onClick={() => setShowExtra((v) => !v)}>
                            {showExtra ? "Hide" : "Show"} extra content
                        </Button>
                        <Resizable>
                            <div className="border-card-border rounded border p-4">
                                <p>Always visible content</p>
                                {showExtra && <p className="text-secondary mt-4">This extra content causes the container to grow smoothly.</p>}
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
import { Button, Resizable } from "@g4rcez/components";

function GrowingList() {
  const [items, setItems] = useState(["Item 1", "Item 2"]);
  return (
    <div className="flex flex-col gap-4">
      <Button type="button" onClick={() => setItems((v) => [...v, \`Item \${v.length + 1}\`])}>
        Add item
      </Button>
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
                            <ul className="divide-card-border border-card-border divide-y rounded border">
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
