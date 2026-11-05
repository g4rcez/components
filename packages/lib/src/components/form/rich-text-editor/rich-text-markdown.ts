import type { JSONContent } from "@tiptap/core";
import DOMPurify from "dompurify";
import { Lexer } from "marked";

/** Only absolute web URLs without credentials are accepted; mailto is link-only. */
export function safeRichTextUrl(value: string, image = false): boolean {
    if (!value || value !== value.trim() || /[\u0000-\u0020\u007f]/u.test(value)) return false;
    try {
        const url = new URL(value);
        return !url.username && !url.password && (url.protocol === "https:" || url.protocol === "http:" || (!image && url.protocol === "mailto:"));
    } catch {
        return false;
    }
}

function unsafeToken(value: unknown): boolean {
    if (Array.isArray(value)) return value.some(unsafeToken);
    if (typeof value !== "object" || value === null) return false;
    if ("type" in value && value.type === "html") return true;
    if (
        "type" in value &&
        (value.type === "link" || value.type === "image") &&
        (!("href" in value) || typeof value.href !== "string" || !safeRichTextUrl(value.href, value.type === "image"))
    )
        return true;
    return Object.values(value).some(unsafeToken);
}

// Compare Markdown meaning, not delimiter style, list tightness, indentation or trailing blanks.
// A conservative mismatch keeps the original source editable instead of guessing at conversion.
function semanticTokens(value: unknown): unknown {
    if (Array.isArray(value))
        return value.filter((item) => typeof item !== "object" || item === null || !("type" in item) || item.type !== "space").map(semanticTokens);
    if (typeof value !== "object" || value === null) return typeof value === "string" ? value.replace(/\r\n?/gu, "\n") : value;
    const keys = ["type", "depth", "ordered", "start", "task", "checked", "href", "title", "lang", "align", "header", "rows", "items", "tokens"];
    if (!("tokens" in value) || !Array.isArray(value.tokens)) keys.push("text");
    return Object.fromEntries(
        Object.entries(value)
            .filter(([key, item]) => keys.includes(key) && item !== undefined)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => [key, semanticTokens(item)])
    );
}

export function markdownSafetyIssue(source: string): string | null {
    try {
        if (unsafeToken(Lexer.lex(source, { gfm: true })))
            return "Raw HTML or an unsupported link/image URL is present. Edit the source; rich view will not load or remove it.";
        return null;
    } catch {
        return "This Markdown could not be parsed. The original source is still available for editing.";
    }
}

export function markdownEquivalent(original: string, serialized: string): boolean {
    return (
        JSON.stringify(semanticTokens(Lexer.lex(original, { gfm: true }))) === JSON.stringify(semanticTokens(Lexer.lex(serialized, { gfm: true })))
    );
}

/** DOMPurify is the HTML trust boundary; ProseMirror subsequently applies its node schema. */
export function sanitizeRichTextPaste(html: string): string {
    const fragment = DOMPurify.sanitize(html, {
        RETURN_DOM_FRAGMENT: true,
        ALLOWED_TAGS: [
            "p",
            "br",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "strong",
            "b",
            "em",
            "i",
            "s",
            "del",
            "ul",
            "ol",
            "li",
            "blockquote",
            "pre",
            "code",
            "a",
            "img",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
            "hr",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "start", "data-type", "data-checked", "data-rich-text-src"],
        ALLOW_DATA_ATTR: false,
    });
    for (const link of fragment.querySelectorAll("a[href]")) {
        if (!safeRichTextUrl(link.getAttribute("href") ?? "")) link.removeAttribute("href");
    }
    for (const image of fragment.querySelectorAll("img")) {
        const source = image.getAttribute("data-rich-text-src") ?? image.getAttribute("src") ?? "";
        if (!safeRichTextUrl(source, true)) image.replaceWith(fragment.ownerDocument.createTextNode(image.getAttribute("alt") ?? ""));
        else {
            image.setAttribute("data-rich-text-src", source);
            image.removeAttribute("src");
        }
    }
    const container = fragment.ownerDocument.createElement("div");
    container.append(fragment);
    return container.innerHTML;
}

/** Defense in depth for the parsed document, independent of paste handling. */
export function safeRichTextDocument(node: JSONContent): boolean {
    if (node.type === "image" && (typeof node.attrs?.src !== "string" || !safeRichTextUrl(node.attrs.src, true))) return false;
    if (node.marks?.some((mark) => mark.type === "link" && (typeof mark.attrs?.href !== "string" || !safeRichTextUrl(mark.attrs.href)))) return false;
    return node.content?.every(safeRichTextDocument) ?? true;
}

/** Markdown moves emphasis-run edge spaces outside delimiters; code/link spaces remain meaningful. */
function normalizeInlineMarks(content: JSONContent[]): JSONContent[] {
    let nodes = content;
    for (const type of ["bold", "italic", "strike"]) {
        const output: JSONContent[] = [];
        const marked = (node: JSONContent) => node.type === "text" && node.marks?.some((mark) => mark.type === type);
        for (let start = 0; start < nodes.length; ) {
            if (!marked(nodes[start])) {
                output.push(nodes[start++]);
                continue;
            }
            let end = start + 1;
            while (end < nodes.length && marked(nodes[end])) end++;
            let first = start;
            while (first < end && !(nodes[first].text ?? "").trim()) first++;
            let last = end - 1;
            while (last >= first && !(nodes[last].text ?? "").trim()) last--;
            for (let index = start; index < end; index++) {
                const node = nodes[index];
                const text = node.text ?? "";
                const from = index < first ? text.length : index === first ? text.length - text.trimStart().length : 0;
                const to = index > last ? from : index === last ? text.trimEnd().length : text.length;
                const unmarked = node.marks?.filter((mark) => mark.type !== type);
                const piece = (text: string, marks: JSONContent["marks"]) => {
                    if (text) output.push({ ...node, text, marks });
                };
                piece(text.slice(0, from), unmarked);
                piece(text.slice(from, to), node.marks);
                piece(text.slice(Math.max(from, to)), unmarked);
            }
            start = end;
        }
        nodes = output;
    }
    const merged: JSONContent[] = [];
    for (const node of nodes) {
        const next = { ...node };
        if (!next.marks?.length) delete next.marks;
        const previous = merged.at(-1);
        if (previous?.type === "text" && next.type === "text" && JSON.stringify(previous.marks) === JSON.stringify(next.marks))
            previous.text = (previous.text ?? "") + (next.text ?? "");
        else merged.push(next);
    }
    return merged;
}

/** Compare Markdown meaning while retaining literal spaces and meaningful mark/structure differences. */
export function richTextDocumentsEquivalent(left: JSONContent, right: JSONContent): boolean {
    const normalize = (node: JSONContent): JSONContent => {
        if (!node.content) return node;
        const content = normalizeInlineMarks(node.content.map(normalize));
        // Paragraph-edge editing spaces survive in serialized source, but Markdown parsing
        // omits them. Never trim code/link-marked text or explicit hard-break nodes.
        if (node.type === "paragraph" || node.type === "heading") {
            const first = content[0];
            const last = content.at(-1);
            if (first?.type === "text" && !first.marks?.length) first.text = first.text?.trimStart();
            if (last?.type === "text" && !last.marks?.length) last.text = last.text?.trimEnd();
        }
        return {
            ...node,
            content: content.filter(
                (child) => (child.type !== "text" || Boolean(child.text)) && (child.type !== "paragraph" || Boolean(child.content?.length))
            ),
        };
    };
    return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

/** Rich selections use ProseMirror positions, never pretend these are source offsets. */
export interface RichTextSelection {
    mode: "rich" | "source";
    text: string;
    from: number;
    to: number;
    /** Exact controlled Markdown at the time of selection; callers can reject stale context. */
    value: string;
}

export function sourceRichTextSelection(value: string, start: number, end: number): RichTextSelection | null {
    // Textareas expose normalized LF positions even while controlled Markdown retains CRLF.
    const sourceOffset = (position: number) => {
        let offset = 0;
        let displayed = 0;
        while (offset < value.length && displayed < Math.max(0, position)) {
            offset += value[offset] === "\r" && value[offset + 1] === "\n" ? 2 : 1;
            displayed++;
        }
        return offset;
    };
    const from = sourceOffset(start);
    const to = Math.max(from, sourceOffset(end));
    return from === to ? null : { mode: "source", from, to, text: value.slice(from, to), value };
}
