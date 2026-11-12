"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { CheckIcon, CodeIcon, HammerIcon, PushPinIcon, PushPinSlashIcon, ShieldCheckIcon, ShieldIcon } from "@phosphor-icons/react";
import { ActionSwap, Card, type ActionSwapState } from "@g4rcez/components";
import { useState } from "react";

const pin: ActionSwapState[] = [
    { id: "pin", label: "Pin", icon: <PushPinIcon aria-hidden weight="bold" />, tone: "primary" },
    { id: "pinned", label: "Pinned", icon: <PushPinSlashIcon aria-hidden weight="bold" />, tone: "neutral" },
];

const compile: ActionSwapState[] = [
    { id: "compile", label: "Compile", icon: <HammerIcon aria-hidden weight="bold" />, tone: "primary", pendingLabel: "Compiling" },
    { id: "compiled", label: "Compiled", icon: <CheckIcon aria-hidden weight="bold" />, tone: "success", holdFor: 1800 },
];

const typing: ActionSwapState[] = [
    { id: "dynamic", label: "Dynamic", icon: <CodeIcon aria-hidden weight="bold" />, tone: "quiet" },
    { id: "gradual", label: "Gradual", icon: <ShieldIcon aria-hidden weight="bold" />, tone: "neutral" },
    { id: "static", label: "Static", icon: <ShieldCheckIcon aria-hidden weight="bold" />, tone: "success" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ActionSwapPage() {
    const [attempt, setAttempt] = useState(0);
    const [mode, setMode] = useState("dynamic");

    return (
        <DocsLayout
            title="ActionSwap"
            section="display"
            description="A pill button that cycles through related states, like Pin and Pinned, with width, tone, icon and label morphing together."
            useWhen="Use ActionSwap for a single control that cycles through a short list of related states: pin and unpin, compile and compiled, dynamic, gradual and static typing."
            avoidWhen="Avoid it for a one-off save, where a Button with a loading state is enough, and for choosing between many options, where a Select or Tabs fit better."
            accessibility="It is a native button. Its accessible name is the visible label (the state's label while it is working), Enter and Space advance the state, and a polite live region announces each new label and any failure. While an action is pending it sets aria-busy and aria-disabled."
        >
            <ComponentDemo
                title="Pin a language"
                description="Each press moves to the next state and wraps around. Only the characters that change roll in; width, tone and icon move together."
                code={`"use client";
import { PushPinIcon, PushPinSlashIcon } from "@phosphor-icons/react";
import { ActionSwap, type ActionSwapState } from "@g4rcez/components";

const states: ActionSwapState[] = [
  { id: "pin", label: "Pin", icon: <PushPinIcon aria-hidden weight="bold" />, tone: "primary" },
  { id: "pinned", label: "Pinned", icon: <PushPinSlashIcon aria-hidden weight="bold" />, tone: "neutral" },
];

function PinLanguage() {
  return <ActionSwap states={states} />;
}`}
            >
                <Card title="Two states">
                    <div className="flex flex-wrap items-center gap-4">
                        <ActionSwap size="sm" states={pin} />
                        <ActionSwap states={pin} />
                        <ActionSwap size="lg" states={pin} />
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Async action with a confirmation"
                description="Return a promise from onAction to show a working phase, at least 450ms so it never flashes. The next state shows when it resolves. A rejection shows failureLabel for 1.8 seconds and pressing again retries. holdFor sends the button back on its own."
                onReset={() => setAttempt(0)}
                code={`"use client";
import { CheckIcon, HammerIcon } from "@phosphor-icons/react";
import { ActionSwap, type ActionSwapState } from "@g4rcez/components";

const states: ActionSwapState[] = [
  { id: "compile", label: "Compile", icon: <HammerIcon aria-hidden weight="bold" />, tone: "primary", pendingLabel: "Compiling" },
  { id: "compiled", label: "Compiled", icon: <CheckIcon aria-hidden weight="bold" />, tone: "success", holdFor: 1800 },
];

function CompileButton() {
  return <ActionSwap states={states} failureLabel="Build failed" onAction={() => compiler.build("main.rs")} />;
}`}
            >
                <Card title="Compile, compiled, and a failure">
                    <div className="flex flex-col items-start gap-4">
                        <ActionSwap
                            states={compile}
                            failureLabel="Build failed"
                            onAction={async () => {
                                await wait(900);
                                setAttempt((count) => count + 1);
                                if (attempt % 2 === 0) throw new Error("syntax error");
                            }}
                        />
                        <p className="text-muted-foreground text-sm">The first press fails and the second succeeds, so you can see both paths.</p>
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Controlled with three states"
                description="Pass value and onValueChange to own the state. The list can have any length; the state is identified by its id."
                code={`"use client";
import { useState } from "react";
import { ActionSwap } from "@g4rcez/components";

function TypeChecking() {
  const [mode, setMode] = useState("dynamic");
  return <ActionSwap states={typing} value={mode} onValueChange={setMode} />;
}`}
            >
                <Card title="Type checking">
                    <div className="flex flex-col items-start gap-4">
                        <ActionSwap states={typing} value={mode} onValueChange={setMode} />
                        <p className="text-muted-foreground text-sm" role="status">
                            Current value: {mode}
                        </p>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
