"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Card } from "../../../../../lib/src";
import { Slider } from "../../../../../lib/src/components/form/slider";

export default function SliderPage() {
  return (
    <DocsLayout
      title="Slider"
      section="form"
      description="Volume or range, just slide it."
    >
      <Card>
        <Slider defaultValue={[50, 75]} min={1} max={100} />
      </Card>
    </DocsLayout>
  );
}
