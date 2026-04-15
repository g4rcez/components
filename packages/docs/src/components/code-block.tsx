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
      <div className="rounded-xl overflow-hidden border border-white/[0.06] dark:bg-[#0a0f1e]">
        <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-b border-white/[0.06]">
          <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/25 rounded-full text-blue-400 text-[10px]">
            {lang}
          </span>
          <button
            disabled
            className="px-2.5 py-1 rounded text-xs bg-white/5 border border-white/10 text-slate-400 transition flex items-center gap-1.5"
          >
            <CopyIcon className="size-3" />
            Copy
          </button>
        </div>
        <div className="relative p-6 font-mono text-[13px] overflow-x-auto min-h-[100px]">
          <pre className="opacity-50">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-card-border">
      <div className="flex justify-between items-center px-4 py-2 border-b border-card-border">
        <Tag size="small">{lang}</Tag>
        <Button size="small" theme="ghost-muted" onClick={handleCopy}>
          {copied ? (
            <CheckIcon className="size-3" />
          ) : (
            <CopyIcon className="size-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div
        className="relative font-mono text-xs overflow-x-auto shiki-container"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
};
