"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { useState } from "react";
import { Button, Card, Masonry, type MasonryLayout } from "@g4rcez/components";

const cards = [
    {
        title: "Source order",
        body: "Items stay in the same DOM order you render, so screen readers and keyboard users do not inherit a visual-only sorting model.",
    },
    {
        title: "Measured layout",
        body: "The component measures rendered item heights and places each item in the shortest column. It does not rely on experimental CSS masonry support.",
    },
    {
        title: "Images and async content",
        body: "The root listens for load and error events, then schedules a fresh measurement so late-loading media can settle into the grid.",
    },
    {
        title: "Browser compatibility",
        body: "ResizeObserver powers responsive measurement in modern browsers while the underlying DOM remains plain semantic HTML.",
    },
    {
        title: "Semantic defaults",
        body: "Masonry renders a ul with li wrappers by default. Switch itemAs only when your content has a stronger semantic container.",
    },
    ...Array.from({ length: 50 }).map((_, i) => ({ title: `Index ${i}`, body: "Lorem ipsum dolor sit amet".repeat(Math.ceil(Math.random() * 10)) })),
];

export default function MasonryPage() {
    const [fresh, setFresh] = useState(0);
    const [layout, setLayout] = useState<MasonryLayout | null>(null);

    return (
        <DocsLayout title="Masonry" section="display" description="A measured, accessible masonry layout for cards and media with uneven heights.">
            <ComponentDemo
                title="Basic Masonry"
                description="Render cards with uneven heights in source order. Masonry handles the visual placement without changing the semantic reading order."
                code={`"use client";
import { Card, Masonry } from "@g4rcez/components";

function BasicMasonry() {
  return (
    <Masonry columns={3} gutter={16}>
      <Card title="Source order">Items stay in DOM order.</Card>
      <Card title="Measured layout">Heights are measured after render.</Card>
      <Card title="Compatibility">No experimental CSS masonry.</Card>
    </Masonry>
  );
}`}
            >
                <Masonry columns={3} gutter={16}>
                    {cards.map((card, index) => (
                        <Card
                            key={card.title}
                            title={card.title}
                            className="text-typography-sm flex flex-col gap-base leading-relaxed text-muted-foreground"
                        >
                            <p>{card.body}</p>
                            {index % 2 === 0 ? (
                                <p>Use it for feature cards, image captions, release notes, or any content feed with uneven heights.</p>
                            ) : null}
                            {index === 1 ? <p>The visual arrangement is decorative; the DOM remains the source of truth.</p> : null}
                        </Card>
                    ))}
                </Masonry>
            </ComponentDemo>

            <ComponentDemo
                title="Controlled Measurement"
                description="Use columns and gutter to tune the layout. Changing fresh requests a new measurement, and onLayoutChange exposes the computed columns and height."
                code={`"use client";
import { useState } from "react";
import { Button, Card, Masonry, type MasonryLayout } from "@g4rcez/components";

function ControlledMasonry() {
  const [fresh, setFresh] = useState(0);
  const [layout, setLayout] = useState<MasonryLayout | null>(null);

  return (
    <div className="flex flex-col gap-base">
      <Button onClick={() => setFresh((value) => value + 1)}>Measure again</Button>
      <Masonry columns={2} gutter={24} fresh={fresh} onLayoutChange={setLayout}>
        <Card title="Alpha">Short card.</Card>
        <Card title="Beta">Longer card with more content.</Card>
        <Card title="Gamma">Another item.</Card>
      </Masonry>
      <p>{layout ? "Columns: " + layout.columns + ", height: " + layout.height + "px" : "Waiting for layout"}</p>
    </div>
  );
}`}
            >
                <div className="flex w-full flex-col gap-base">
                    <div className="flex flex-wrap items-center justify-between gap-base">
                        <Button onClick={() => setFresh((value) => value + 1)}>Measure again</Button>
                        <p className="text-typography-sm text-muted-foreground" aria-live="polite">
                            {layout ? `Columns: ${layout.columns}, height: ${Math.round(layout.height)}px` : "Waiting for layout"}
                        </p>
                    </div>
                    <Masonry columns={2} gutter={24} fresh={fresh} onLayoutChange={setLayout}>
                        <Card title="Alpha" className="text-typography-sm text-muted-foreground">
                            Short card.
                        </Card>
                        <Card title="Beta" className="text-typography-sm flex flex-col gap-base text-muted-foreground">
                            <p>Longer card with more content to demonstrate how the measured layout balances column heights.</p>
                            <p>When the measurement changes, the callback exposes the resulting layout shape.</p>
                        </Card>
                        <Card title="Gamma" className="text-typography-sm text-muted-foreground">
                            Another item in source order.
                        </Card>
                    </Masonry>
                </div>
            </ComponentDemo>

            <section className="text-typography-sm space-y-base rounded-card-radius border border-card-border bg-card-background p-base leading-relaxed text-muted-foreground">
                <h3 id="accessibility-and-compatibility" className="text-typography-xl font-bold text-foreground">
                    Accessibility and Compatibility
                </h3>
                <p>
                    Masonry uses measured absolute positioning instead of experimental native CSS masonry. The rendered children stay in source order,
                    and the default structure is a semantic list, which keeps assistive technology and keyboard navigation aligned with the authored
                    content order.
                </p>
            </section>
        </DocsLayout>
    );
}
