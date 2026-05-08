"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button, Tag } from "../../../lib/src";

type CodeBlockProps = {
    code: string;
    lang?: string;
};

export const CodeBlock = ({ code, lang = "tsx" }: CodeBlockProps) => {
    const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const highlight = async () => {
            try {
                const html = await codeToHtml(code, {
                    lang,
                    themes: {
                        light: "github-light",
                        dark: "catppuccin-mocha",
                    },
                    defaultColor: false,
                });
                if (isMounted) {
                    setHighlightedCode(html);
                }
            } catch (error) {
                console.error("Failed to highlight code:", error);
            }
        };

        highlight();
        return () => {
            isMounted = false;
        };
    }, [code, lang]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!highlightedCode) {
        return (
            <div className="overflow-hidden rounded-xl border border-white/[0.06] dark:bg-[#0a0f1e]">
                <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/40 px-4 py-2">
                    <span className="rounded-full border border-blue-500/25 bg-blue-500/15 px-2 py-0.5 text-[10px] text-blue-400">{lang}</span>
                    <button
                        disabled
                        className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400 transition"
                    >
                        <CopyIcon className="size-3" />
                        Copy
                    </button>
                </div>
                <div className="relative min-h-[100px] overflow-x-auto p-6 font-mono text-[13px]">
                    <pre className="opacity-50">
                        <code>{code}</code>
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-card-border">
            <div className="flex items-center justify-between border-b border-card-border px-4 py-2">
                <Tag size="small">{lang}</Tag>
                <Button size="small" theme="ghost-muted" onClick={handleCopy}>
                    {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                    {copied ? "Copied" : "Copy"}
                </Button>
            </div>
            <div className="shiki-container relative overflow-x-auto font-mono text-xs" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </div>
    );
};
