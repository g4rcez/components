"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Slider, Card } from "@g4rcez/components";

export default function SliderPage() {
    return (
        <DocsLayout title="Slider" section="form" description="A range input component to select values by sliding.">
            <ComponentDemo
                title="Basic Range Slider"
                description="A slider with two thumbs allowing selection of a range between a minimum and maximum value."
                code={`"use client";
import { Slider } from "@g4rcez/components";

function BasicRangeSlider() {
  return (
    <Slider defaultValue={[50, 75]} min={1} max={100} />
  );
}`}
            >
                <Card>
                    <Slider defaultValue={[50, 75]} min={1} max={100} />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
