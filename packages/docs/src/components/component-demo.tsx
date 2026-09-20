"use client";

import { ArrowCounterClockwiseIcon, LinkIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { type PropsWithChildren, useState } from "react";
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
                    <button type="button" className="docs-reset-button" onClick={handleReset}>
                        <ArrowCounterClockwiseIcon size={15} aria-hidden="true" />
                        Reset
                    </button>
                ) : null}
            </div>
            <div className="docs-example-panel">
                <div className={`docs-example-preview ${demoClassName}`}>{children}</div>
                <div className="docs-example-code">
                    <CodeBlock code={code} />
                </div>
            </div>
            <span className="sr-only" role="status" aria-live="polite">
                {resetAnnouncement}
            </span>
        </section>
    );
};
