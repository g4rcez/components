"use client";

import { ArrowCounterClockwiseIcon, CodeIcon, LinkIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { type PropsWithChildren, useId, useState } from "react";
import { Button } from "@g4rcez/components";
import { CodeBlock } from "./code-block";

type ComponentDemoProps = {
    title: string;
    description: string;
    code: string;
    className?: string;
    demoClassName?: string;
    onReset?: () => void;
};

const slugify = (value: string) => value.toLocaleLowerCase().replace(/\s+/g, "-");

/**
 * A live example in a preview panel, with its source one press away. The source is only rendered (and highlighted)
 * once it is opened, so a page with many demos stays light.
 */
export const ComponentDemo = ({
    title,
    description,
    code,
    children,
    className = "",
    demoClassName = "",
    onReset,
}: PropsWithChildren<ComponentDemoProps>) => {
    const id = slugify(title);
    const codeId = useId();
    const [showCode, setShowCode] = useState(false);
    const [resetAnnouncement, setResetAnnouncement] = useState("");

    const handleReset = () => {
        onReset?.();
        setResetAnnouncement(`${title} demo reset.`);
    };

    return (
        <section id={id} className={`docs-example ${className}`} aria-labelledby={`${id}-heading`}>
            <div className="docs-example-heading">
                <div>
                    <h3 id={`${id}-heading`} className="docs-example-title">
                        <span>{title}</span>
                        <Link className="docs-example-anchor" href={`#${id}`} aria-label={`Link to ${title}`}>
                            <LinkIcon className="docs-example-link-icon" size={15} aria-hidden="true" />
                        </Link>
                    </h3>
                    <p className="docs-example-description">{description}</p>
                </div>
                {onReset ? (
                    <Button type="button" size="small" theme="ghost-neutral" className="docs-reset-button" onClick={handleReset}>
                        <ArrowCounterClockwiseIcon size={15} aria-hidden="true" />
                        Reset
                    </Button>
                ) : null}
            </div>
            <div className="docs-example-panel">
                <div className={`docs-example-preview ${demoClassName}`}>{children}</div>
                <div className="docs-example-code" data-open={showCode ? "true" : "false"}>
                    <Button
                        type="button"
                        size="small"
                        theme="ghost-neutral"
                        className="docs-example-toggle"
                        aria-expanded={showCode}
                        aria-controls={codeId}
                        onClick={() => setShowCode((value) => !value)}
                    >
                        <CodeIcon size={15} aria-hidden="true" />
                        {showCode ? "Hide code" : "Show code"}
                    </Button>
                    <div id={codeId} hidden={!showCode}>
                        {showCode ? <CodeBlock code={code} /> : null}
                    </div>
                </div>
            </div>
            <span className="sr-only" role="status" aria-live="polite">
                {resetAnnouncement}
            </span>
        </section>
    );
};
