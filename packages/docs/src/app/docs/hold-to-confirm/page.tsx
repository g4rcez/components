"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { GitMergeIcon } from "@phosphor-icons/react";
import { Card, HoldToConfirm } from "@g4rcez/components";
import { useState } from "react";

export default function HoldToConfirmPage() {
    const [deleted, setDeleted] = useState(false);
    const [holding, setHolding] = useState(false);
    const [merged, setMerged] = useState(false);

    return (
        <DocsLayout
            title="HoldToConfirm"
            section="display"
            description="A button that runs its action only after being held down, for destructive actions whose consequence is already visible on screen."
            useWhen="Use HoldToConfirm for destructive or hard-to-undo actions, like deleting a branch or force pushing, where the person can already see what will happen."
            avoidWhen="Avoid it for safe, easily reversed actions, where a Button is enough, and when people need to read the consequences first, where a Modal fits better."
            accessibility="Press and hold with a mouse, finger or pen, or hold Space or Enter. Releasing early, tabbing away or sliding well off the button cancels. A hidden hint describes the hold, the label follows the visible text and a polite status announces the result."
        >
            <ComponentDemo
                title="Delete a branch"
                description="The fill advances while held and rewinds on release. Completion calls onConfirm once, swaps the label and draws a check. Pass confirmed to reset the button after an undo or a failed request."
                onReset={() => setDeleted(false)}
                code={`"use client";
import { useState } from "react";
import { HoldToConfirm } from "@g4rcez/components";

function DeleteBranch() {
  const [deleted, setDeleted] = useState(false);
  return (
    <HoldToConfirm
      label="Hold to delete branch"
      confirmedLabel="Branch deleted"
      confirmed={deleted}
      onConfirm={() => setDeleted(true)}
    />
  );
}`}
            >
                <Card title="Danger tone">
                    <div className="flex flex-col items-start gap-4">
                        <HoldToConfirm
                            label="Hold to delete branch"
                            confirmedLabel="Branch deleted"
                            confirmed={deleted}
                            onConfirm={() => setDeleted(true)}
                        />
                        <p className="text-muted-foreground text-sm" role="status">
                            {deleted ? "The branch was deleted. Use Reset to try again." : "Nothing deleted yet."}
                        </p>
                    </div>
                </Card>
            </ComponentDemo>
            <ComponentDemo
                title="Neutral tone and custom duration"
                description="duration sets the hold in milliseconds, tone switches the fill to a neutral color and icon replaces the leading trash icon. onHoldChange reports when a hold starts and ends."
                onReset={() => setMerged(false)}
                code={`"use client";
import { useState } from "react";
import { GitMergeIcon } from "@phosphor-icons/react";
import { HoldToConfirm } from "@g4rcez/components";

function MergePullRequest() {
  const [holding, setHolding] = useState(false);
  const [merged, setMerged] = useState(false);
  return (
    <>
      <HoldToConfirm
        tone="neutral"
        duration={2000}
        icon={<GitMergeIcon aria-hidden />}
        label="Hold to merge"
        confirmedLabel="Merged"
        confirmed={merged}
        onHoldChange={setHolding}
        onConfirm={() => setMerged(true)}
      />
      <p>{holding ? "Keep holding to merge into main." : "Hold the button for two seconds."}</p>
    </>
  );
}`}
            >
                <Card title="Two second hold">
                    <div className="flex flex-col items-start gap-4">
                        <HoldToConfirm
                            tone="neutral"
                            duration={2000}
                            icon={<GitMergeIcon aria-hidden />}
                            label="Hold to merge"
                            confirmedLabel="Merged"
                            onHoldChange={setHolding}
                            confirmed={merged}
                            onConfirm={() => setMerged(true)}
                        />
                        <p className="text-muted-foreground text-sm" aria-live="polite">
                            {holding ? "Keep holding to merge into main." : "Hold the button for two seconds."}
                        </p>
                    </div>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
