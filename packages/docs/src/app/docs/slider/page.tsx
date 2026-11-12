"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { SpeakerHighIcon, SpeakerNoneIcon, SunDimIcon, SunIcon } from "@phosphor-icons/react";
import { Card, Slider } from "@g4rcez/components";
import { useState } from "react";

const speeds = [
    { value: 0.5, label: "0.5×" },
    { value: 1, label: "1×" },
    { value: 1.5, label: "1.5×" },
    { value: 2, label: "2×" },
];

export default function SliderPage() {
    const [volume, setVolume] = useState<readonly number[]>([40]);
    const [committed, setCommitted] = useState("Release the thumb to commit.");

    return (
        <DocsLayout
            title="Slider"
            section="form"
            description="Select one value or a range by sliding. Dragging past either end stretches the track like rubber, and marks act as detents."
            useWhen="Use Slider for one continuous value where feel matters, like volume, brightness, zoom or playback speed, or for a range with two thumbs. Use marks for common targets."
            avoidWhen="Avoid it for exact numeric entry, where an Input fits, and for a handful of discrete choices, where Radiobox or Tabs fit."
            accessibility="Each thumb is a native range input, so it is a slider with its value, minimum and maximum. Pass label to name it (a range numbers its thumbs) and formatValue to give aria-valuetext a unit. Arrows move one step, Shift+Arrow, PageUp and PageDown move by largeStep, Home and End jump to the limits, and at a limit the track stretches toward the key and snaps back. Icons, the value tag and mark labels are hidden from assistive technology."
        >
            <ComponentDemo
                title="Basic Range Slider"
                description="A slider with two thumbs allowing selection of a range between a minimum and maximum value."
                code={`"use client";
import { Slider } from "@g4rcez/components";

function BasicRangeSlider() {
  return (
    <Slider label="Range" defaultValue={[50, 75]} min={1} max={100} />
  );
}`}
            >
                <Card>
                    <Slider label="Range" defaultValue={[50, 75]} min={1} max={100} />
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Elastic volume with icons"
                description="Drag past either end to feel the track stretch and spring back with your release speed. The thumb swells while held and the value tag, which sways with the thumb's speed, appears on hover, focus or drag."
                code={`"use client";
import { SpeakerHighIcon, SpeakerNoneIcon } from "@phosphor-icons/react";
import { Slider } from "@g4rcez/components";

function Volume() {
  return (
    <Slider
      label="Volume"
      tooltip
      defaultValue={[40]}
      formatValue={(value) => \`\${value}%\`}
      startIcon={<SpeakerNoneIcon aria-hidden />}
      endIcon={<SpeakerHighIcon aria-hidden />}
    />
  );
}`}
            >
                <Card title="Volume">
                    <Slider
                        label="Volume"
                        tooltip
                        value={volume}
                        onValueChange={(next) => setVolume(Array.isArray(next) ? next : [next as number])}
                        formatValue={(value) => `${value}%`}
                        startIcon={<SpeakerNoneIcon aria-hidden size={20} />}
                        endIcon={<SpeakerHighIcon aria-hidden size={20} />}
                    />
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Marks as detents"
                description="Marks are soft snaps: a dragged thumb holds on each one for about seven pixels and the tick pops, with a short vibration where the device supports it. They never block the values in between. Labelled marks print under the track and can be pressed. onValueCommitted fires when you release, press a key or press a label."
                onReset={() => setCommitted("Release the thumb to commit.")}
                code={`"use client";
import { Slider } from "@g4rcez/components";

const speeds = [
  { value: 0.5, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 1.5, label: "1.5×" },
  { value: 2, label: "2×" },
];

function PlaybackSpeed() {
  return (
    <Slider
      label="Playback speed"
      min={0.5}
      max={2}
      step={0.05}
      defaultValue={[1]}
      marks={speeds}
      formatValue={(value) => \`\${value.toFixed(2)}×\`}
      onValueCommitted={(value) => save(value)}
    />
  );
}`}
            >
                <Card title="Playback speed">
                    <div className="flex flex-col gap-6">
                        <Slider
                            label="Playback speed"
                            tooltip
                            min={0.5}
                            max={2}
                            step={0.05}
                            defaultValue={[1]}
                            marks={speeds}
                            formatValue={(value) => `${value.toFixed(2)}×`}
                            onValueCommitted={(value) => setCommitted(`Committed ${JSON.stringify(value)}`)}
                        />
                        <p className="text-muted-foreground text-sm" role="status">
                            {committed}
                        </p>
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Range with marks and no stretch"
                description="Ranges keep every Base UI prop. Set elastic to false to turn the rubber band off; reduced motion turns it off on its own."
                code={`"use client";
import { Slider } from "@g4rcez/components";

function Price() {
  return <Slider label="Price" elastic={false} min={0} max={1000} step={10} defaultValue={[200, 800]} marks={[0, 500, 1000]} tooltip />;
}`}
            >
                <Card title="Price range">
                    <Slider label="Price" elastic={false} min={0} max={1000} step={10} defaultValue={[200, 800]} marks={[0, 500, 1000]} tooltip />
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Brightness"
                description="A single value with icons at both ends and a tag. The icons are decoration: the slider conveys the value."
                code={`"use client";
import { SunDimIcon, SunIcon } from "@phosphor-icons/react";
import { Slider } from "@g4rcez/components";

function Brightness() {
  return <Slider label="Brightness" defaultValue={70} startIcon={<SunDimIcon aria-hidden />} endIcon={<SunIcon aria-hidden />} />;
}`}
            >
                <Card title="Brightness">
                    <Slider
                        label="Brightness"
                        defaultValue={70}
                        startIcon={<SunDimIcon aria-hidden size={20} />}
                        endIcon={<SunIcon aria-hidden size={20} />}
                    />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
