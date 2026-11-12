import Link from "next/link";
import type { ReactNode } from "react";
import type { Inline } from "./types";

/** Renders the generated inline AST. Internal links use next/link, external ones open in a new tab. */
export const InlineContent = ({ nodes }: { nodes: Inline[] }): ReactNode =>
    nodes.map((node, index) => {
        switch (node.t) {
            case "text":
                return node.v;
            case "code":
                return (
                    <code key={index} className="docs-ref-code">
                        {node.v}
                    </code>
                );
            case "strong":
                return (
                    <strong key={index}>
                        <InlineContent nodes={node.c} />
                    </strong>
                );
            case "em":
                return (
                    <em key={index}>
                        <InlineContent nodes={node.c} />
                    </em>
                );
            case "link":
                return node.href.startsWith("/") ? (
                    <Link key={index} href={node.href}>
                        <InlineContent nodes={node.c} />
                    </Link>
                ) : (
                    <a key={index} href={node.href} target="_blank" rel="noreferrer">
                        <InlineContent nodes={node.c} />
                    </a>
                );
        }
    });

/** Plain text of an inline run, used for ids and accessible names. */
export const inlineText = (nodes: Inline[]): string =>
    nodes
        .map((node) => (node.t === "text" || node.t === "code" ? node.v : inlineText(node.c)))
        .join("")
        .trim();
