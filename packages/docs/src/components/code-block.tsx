"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { codeToHtml } from "shiki";
import { useEffect, useRef, useState } from "react";

type CodeBlockProps = {
    code: string;
    lang?: string;
};

type CopyState = "idle" | "copied" | "error";

export const CodeBlock = ({ code, lang = "tsx" }: CodeBlockProps) => {
    const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
    const [copyState, setCopyState] = useState<CopyState>("idle");
    const resetCopyState = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let isMounted = true;
        setHighlightedCode(null);

        void codeToHtml(code, {
            lang,
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
            defaultColor: false,
        })
            .then((html) => {
                if (isMounted) setHighlightedCode(html);
            })
            .catch(() => {
                if (isMounted) setHighlightedCode(null);
            });

        return () => {
            isMounted = false;
        };
    }, [code, lang]);

    useEffect(() => {
        return () => {
            if (resetCopyState.current) clearTimeout(resetCopyState.current);
        };
    }, []);

    const handleCopy = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
            await navigator.clipboard.writeText(code);
            setCopyState("copied");
        } catch {
            setCopyState("error");
        }

        if (resetCopyState.current) clearTimeout(resetCopyState.current);
        resetCopyState.current = setTimeout(() => setCopyState("idle"), 2200);
    };

    const copyLabel = copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy";

    return (
        <div className="docs-code-block">
            <div className="docs-code-toolbar">
                <span className="docs-code-language">{lang}</span>
                <button type="button" className="docs-code-copy" onClick={handleCopy} aria-label={`${copyLabel} code example`}>
                    {copyState === "copied" ? <CheckIcon size={15} aria-hidden="true" /> : <CopyIcon size={15} aria-hidden="true" />}
                    <span>{copyLabel}</span>
                </button>
            </div>
            <section className="shiki-container" aria-label={`${lang} code example`}>
                {highlightedCode ? (
                    <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                ) : (
                    <pre>
                        <code>{code}</code>
                    </pre>
                )}
            </section>
            <span className="sr-only" role="status" aria-live="polite">
                {copyState === "copied" ? "Code copied to clipboard." : copyState === "error" ? "Code could not be copied." : ""}
            </span>
        </div>
    );
};
