"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Card } from "../../../../../lib/src";
import { Resizable } from "../../../../../lib/src/components/core/resizable";

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
            <button
              type="button"
              onClick={() => setItems((v) => [...v, `Item ${v.length + 1}`])}
              className="rounded px-4 py-2 bg-primary text-primary-foreground w-fit"
            >
              Add item
            </button>
            <Resizable>
              <ul className="border border-card-border rounded divide-y divide-card-border">
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

      <ComponentDemo
        title="Swap Content"
        description="Switching between content blocks of different heights animates smoothly."
        code={`"use client";
import { useState } from "react";
import { Resizable } from "@g4rcez/components/core/resizable";

function SwapContent() {
  const [tab, setTab] = useState<"a" | "b">("a");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("a")}
          className="rounded px-4 py-2 bg-primary text-primary-foreground"
        >
          Tab A
        </button>
        <button
          type="button"
          onClick={() => setTab("b")}
          className="rounded px-4 py-2 bg-secondary text-secondary-foreground"
        >
          Tab B
        </button>
      </div>
      <Resizable>
        {tab === "a" ? (
          <div className="border border-card-border rounded p-4">
            <p>Short content for Tab A</p>
          </div>
        ) : (
          <div className="border border-card-border rounded p-4">
            <p>Tab B has more content.</p>
            <p className="mt-2 text-secondary">It is taller than Tab A.</p>
            <p className="mt-2 text-secondary">The container adjusts smoothly.</p>
          </div>
        )}
      </Resizable>
    </div>
  );
}`}
      >
        <Card title="Swap content">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {}}
                className="rounded px-4 py-2 bg-primary text-primary-foreground"
              >
                Tab A
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="rounded px-4 py-2 bg-secondary text-secondary-foreground"
              >
                Tab B
              </button>
            </div>
            <Resizable>
              <div className="border border-card-border rounded p-4">
                <p>Content adapts with animated height transitions.</p>
              </div>
            </Resizable>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
