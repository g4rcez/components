"use client";
import { CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "@g4rcez/components";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Blocks } from "./blocks";
import { InlineContent } from "./inline";
import type { Inline, Reference } from "./types";
import { useReference } from "./use-reference";

type GuidanceProps = { title: string; useWhen?: ReactNode; avoidWhen?: ReactNode; accessibility?: ReactNode };

const GuidanceList = ({ items }: { items: Inline[][] }) => (
    <ul className="docs-guidance-list">
        {items.map((item, index) => (
            <li key={index}>
                <InlineContent nodes={item} />
            </li>
        ))}
    </ul>
);

/** "Use when / Avoid when": the page's own words when it has them, otherwise the Do and Don't lists of the reference. */
export const UsageSection = ({ title, useWhen, avoidWhen, reference }: GuidanceProps & { reference: Reference | null }) => {
    const doItems = reference?.usage.do ?? [];
    const dontItems = reference?.usage.dont ?? [];
    return (
        <section id="usage-guidance" className="docs-section docs-usage" aria-labelledby="usage-guidance-title">
            <h2 id="usage-guidance-title" className="docs-section-title">
                When to use {title}
            </h2>
            <div className="docs-guidance-grid">
                <div className="docs-guidance docs-guidance-use">
                    <div className="docs-guidance-heading">
                        <span className="docs-guidance-mark" aria-hidden="true">
                            <CheckIcon size={14} />
                        </span>
                        <h3>Use when</h3>
                    </div>
                    {useWhen ? (
                        <p>{useWhen}</p>
                    ) : doItems.length > 0 ? (
                        <GuidanceList items={doItems} />
                    ) : (
                        <p>You need the documented {title} interaction or presentation in a product workflow.</p>
                    )}
                </div>
                <div className="docs-guidance docs-guidance-avoid">
                    <div className="docs-guidance-heading">
                        <span className="docs-guidance-mark" aria-hidden="true">
                            <WarningCircleIcon size={14} />
                        </span>
                        <h3>Avoid when</h3>
                    </div>
                    {avoidWhen ? (
                        <p>{avoidWhen}</p>
                    ) : dontItems.length > 0 ? (
                        <GuidanceList items={dontItems} />
                    ) : (
                        <p>A native HTML element already provides the {title} behavior you need.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export const AccessibilitySection = ({
    title,
    accessibility,
    reference,
}: Pick<GuidanceProps, "title" | "accessibility"> & { reference: Reference | null }) => (
    <section id="accessibility-notes" className="docs-section docs-accessibility" aria-labelledby="accessibility-notes-title">
        <h2 id="accessibility-notes-title" className="docs-section-title">
            Accessibility
        </h2>
        <p className="docs-ref-text">
            {accessibility ??
                `Keep the ${title} labeled and use its documented keyboard interaction. The component preserves visible focus and communicates state without relying on color alone.`}
        </p>
        {reference && reference.accessibility.length > 0 ? (
            <Blocks blocks={reference.accessibility} idPrefix="accessibility" title={`${title} accessibility`} />
        ) : null}
        {reference && reference.interaction.length > 0 ? (
            <>
                <h3 id="accessibility-interaction" className="docs-ref-heading">
                    Interaction and behavior
                </h3>
                <Blocks blocks={reference.interaction} level={4} idPrefix="interaction" title={`${title} interaction`} />
            </>
        ) : null}
    </section>
);

const CAP = 12;

/** Long token tables (some components have 45+ rows) are clamped, with a button that reveals the rest. */
const TokensSection = ({ title, reference, rows }: { title: string; reference: Reference; rows: number }) => {
    const [expanded, setExpanded] = useState(false);
    const regionId = useId();
    const clamped = rows > CAP && !expanded;
    return (
        <section id="design-tokens" className="docs-section docs-reference" aria-labelledby="design-tokens-title">
            <h2 id="design-tokens-title" className="docs-section-title">
                Design tokens
            </h2>
            <div id={regionId} className="docs-ref-clamp" data-clamped={clamped ? "true" : "false"}>
                <Blocks blocks={reference.tokens} idPrefix="tokens" title={`${title} tokens`} />
            </div>
            {rows > CAP ? (
                <Button
                    type="button"
                    size="small"
                    theme="neutral"
                    className="docs-ref-more"
                    aria-expanded={expanded}
                    aria-controls={regionId}
                    onClick={() => setExpanded((value) => !value)}
                >
                    {expanded ? "Show fewer tokens" : `Show all ${rows} tokens`}
                </Button>
            ) : null}
        </section>
    );
};

/** Without a reference (or before it loads) the page still shows its own usage and accessibility text. */
export const FallbackSections = (props: GuidanceProps) => (
    <>
        <UsageSection {...props} reference={null} />
        <AccessibilitySection title={props.title} accessibility={props.accessibility} reference={null} />
    </>
);

/** Usage, generated API reference, design tokens and accessibility, in that order. */
export const ReferenceSections = ({ slug, onReady, ...guidance }: GuidanceProps & { slug: string; onReady: () => void }) => {
    const reference = useReference(slug);
    useEffect(() => onReady(), [onReady, reference]);
    const { title } = guidance;
    const apiBlocks = [
        ...(reference?.props ?? []),
        ...(reference && reference.attributes.length > 0 ? [{ k: "h" as const, text: "Data attributes" }, ...reference.attributes] : []),
    ];
    const tokenRows = (reference?.tokens ?? []).reduce((total, block) => total + (block.k === "table" ? block.rows.length : 0), 0);

    return (
        <>
            <UsageSection {...guidance} reference={reference} />
            {apiBlocks.length > 0 ? (
                <section id="api-reference" className="docs-section docs-reference" aria-labelledby="api-reference-title">
                    <h2 id="api-reference-title" className="docs-section-title">
                        API reference
                    </h2>
                    <Blocks blocks={apiBlocks} idPrefix="api" title={title} />
                </section>
            ) : null}
            {reference && reference.tokens.length > 0 ? <TokensSection title={title} reference={reference} rows={tokenRows} /> : null}
            <AccessibilitySection title={title} accessibility={guidance.accessibility} reference={reference} />
        </>
    );
};
