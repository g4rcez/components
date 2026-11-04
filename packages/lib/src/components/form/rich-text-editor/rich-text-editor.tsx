"use client";
import { Extension, type Attributes, type JSONContent } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";
import { EditorState, Plugin } from "@tiptap/pm/state";
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { css } from "../../../lib/dom";
import { Button } from "../../core/button/button";
import { Alert } from "../../display/alert/alert";
import { Input } from "../input/input";
import { Textarea } from "../input/textarea";
import { Select } from "../select/select";
import {
    markdownEquivalent,
    markdownSafetyIssue,
    richTextDocumentsEquivalent,
    safeRichTextDocument,
    safeRichTextUrl,
    sanitizeRichTextPaste,
    sourceRichTextSelection,
    type RichTextSelection,
} from "./rich-text-markdown";
import { richTextEditorStyles } from "./rich-text-editor.styles";

export type { RichTextSelection } from "./rich-text-markdown";
export type RichTextEditorMode = "rich" | "source";

export interface RichTextEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "children"> {
    label: string;
    value: string;
    onChange(value: string): void;
    disabled?: boolean;
    readOnly?: boolean;
    name?: string;
    defaultMode?: RichTextEditorMode;
    /** Markdown source character limit, checked before accepting a rich transaction. */
    maxLength?: number;
    onSelectionChange?(selection: RichTextSelection | null): void;
}

const slots = richTextEditorStyles.slots;

function ImageView({ node, selected }: NodeViewProps) {
    const [loadedSource, setLoadedSource] = useState("");
    const source = typeof node.attrs.src === "string" ? node.attrs.src : "";
    const alt = typeof node.attrs.alt === "string" ? node.attrs.alt : "";
    const safe = safeRichTextUrl(source, true);
    return (
        <NodeViewWrapper className={slots.image} data-selected={selected || undefined} contentEditable={false}>
            {safe && loadedSource === source ? (
                <img className={slots["image-content"]} src={source} alt={alt} loading="lazy" referrerPolicy="no-referrer" />
            ) : (
                <>
                    <span>Image: {alt || "No alternative text"}</span>
                    {safe && (
                        <Button size="small" theme="neutral" onClick={() => setLoadedSource(source)}>
                            Load image
                        </Button>
                    )}
                </>
            )}
            <span className={slots.help}>{source}</span>
        </NodeViewWrapper>
    );
}

const PrivateImage = Image.extend({
    addAttributes() {
        const attributes: Attributes = this.parent?.() ?? {};
        return {
            ...attributes,
            src: { ...attributes.src, parseHTML: (element) => element.getAttribute("data-rich-text-src") ?? element.getAttribute("src") },
        };
    },
    parseHTML() {
        return [{ tag: "img[data-rich-text-src]" }, ...(this.parent?.() ?? [])];
    },
    // ProseMirror can briefly use its schema renderer while React node views attach.
    // Even a detached <img src> can fetch, so HTML/clipboard output must stay inert.
    renderHTML({ HTMLAttributes }) {
        const { src, ...attributes } = HTMLAttributes;
        return ["img", { ...this.options.HTMLAttributes, ...attributes, src: null, "data-rich-text-src": src }];
    },
    addNodeView() {
        return ReactNodeViewRenderer(ImageView);
    },
});

/**
 * A controlled, GFM Markdown editor. Switching view never emits onChange.
 * Unsupported or unsafe source remains in source mode, without a lossy fallback.
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor(
    {
        label,
        value,
        onChange,
        disabled = false,
        readOnly = false,
        defaultMode = "rich",
        maxLength,
        onSelectionChange,
        name,
        id: suppliedId,
        className,
        ...props
    },
    ref
) {
    const generatedId = useId();
    const id = suppliedId ?? generatedId;
    const [mode, setMode] = useState<RichTextEditorMode>(defaultMode);
    const [error, setError] = useState("");
    const [, refreshSnapshot] = useState(0);
    const [insert, setInsert] = useState<"link" | "image" | null>(null);
    const [url, setUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");
    const [insertError, setInsertError] = useState("");
    const urlInput = useRef<HTMLInputElement>(null);
    const sourceInput = useRef<HTMLTextAreaElement>(null);
    const current = useRef({ value, onChange, onSelectionChange, disabled, readOnly, maxLength });
    current.current = { value, onChange, onSelectionChange, disabled, readOnly, maxLength };
    const modelValue = useRef<string | null>(null);
    const syncing = useRef(false);
    const insertionRange = useRef({ from: 1, to: 1 });
    const pendingViewFocus = useRef(false);
    const editor = useEditor({
        immediatelyRender: false,
        injectCSS: false,
        shouldRerenderOnTransaction: true,
        editable: !disabled && !readOnly,
        extensions: [
            StarterKit.configure({
                underline: false,
                trailingNode: false,
                link: { openOnClick: false, autolink: false, linkOnPaste: false, isAllowedUri: (url) => safeRichTextUrl(url) },
            }),
            PrivateImage.configure({ allowBase64: false }),
            TableKit.configure({ table: { resizable: false, renderWrapper: true } }),
            TaskList,
            TaskItem.configure({ nested: true, a11y: { checkboxLabel: (node) => `Task: ${node.textContent || "Untitled"}` } }),
            Markdown.configure({ markedOptions: { gfm: true } }),
            Extension.create({
                name: "richTextMarkdownGuard",
                addProseMirrorPlugins() {
                    const instance = this.editor;
                    return [
                        new Plugin({
                            filterTransaction(transaction) {
                                if (!transaction.docChanged || syncing.current) return true;
                                if (current.current.disabled || current.current.readOnly) return false;
                                const json = transaction.doc.toJSON() as JSONContent;
                                if (!safeRichTextDocument(json)) {
                                    setError(
                                        "That change contains an unsupported link or image URL. Use an absolute HTTP(S) URL, or mailto for links."
                                    );
                                    return false;
                                }
                                try {
                                    const markdown = instance.markdown!.serialize(json);
                                    if (current.current.maxLength !== undefined && markdown.length > current.current.maxLength) {
                                        setError("That change exceeds the source character limit. Shorten the content in source view.");
                                        return false;
                                    }
                                    // Reject rich constructs GFM cannot preserve (for example multi-paragraph cells).
                                    const roundTrip = instance.schema.nodeFromJSON(instance.markdown!.parse(markdown));
                                    if (!richTextDocumentsEquivalent(json, roundTrip.toJSON() as JSONContent)) {
                                        setError(
                                            "That change cannot be preserved as Markdown. Use source view for this structure; the previous content is unchanged."
                                        );
                                        return false;
                                    }
                                    setError("");
                                    return true;
                                } catch {
                                    setError("That change could not be serialized safely. The previous content is unchanged; use source view.");
                                    return false;
                                }
                            },
                        }),
                    ];
                },
            }),
        ],
        content: "",
        contentType: "markdown",
        editorProps: {
            attributes: {
                id: `${id}-rich`,
                role: "textbox",
                "aria-multiline": "true",
                "aria-label": label,
                "aria-describedby": `${id}-help`,
                class: slots.content,
            },
            transformPastedHTML: sanitizeRichTextPaste,
            handleDrop: (_view, event) => {
                if (!event.dataTransfer?.files.length) return false;
                setError("File drops are not uploads. Insert an image using an existing HTTP(S) URL instead.");
                return true;
            },
            handlePaste: (_view, event) => {
                if (!event.clipboardData?.files.length) return false;
                setError("Pasted files are not uploads. Insert an image using an existing HTTP(S) URL instead.");
                return true;
            },
        },
        onUpdate: ({ editor }) => {
            if (syncing.current) return;
            const next = editor.getMarkdown();
            modelValue.current = next;
            current.current.onSelectionChange?.(null);
            current.current.onChange(next);
            refreshSnapshot((version) => version + 1);
        },
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection;
            current.current.onSelectionChange?.(
                from === to
                    ? null
                    : {
                          mode: "rich",
                          from,
                          to,
                          text: editor.state.doc.textBetween(from, to, "\n"),
                          value: current.current.value,
                      }
            );
        },
    });

    function loadMarkdown(source: string): boolean {
        if (!editor) return false;
        let issue = markdownSafetyIssue(source);
        try {
            if (!issue) {
                const json = editor.markdown!.parse(source);
                if (!safeRichTextDocument(json) || !markdownEquivalent(source, editor.markdown!.serialize(json)))
                    issue = "Rich view cannot preserve this Markdown structure. Continue editing the original source; nothing has been converted.";
                else {
                    syncing.current = true;
                    try {
                        const doc = editor.schema.nodeFromJSON(json.content?.length ? json : { type: "doc", content: [{ type: "paragraph" }] });
                        // A new controlled snapshot must not undo into a different revision.
                        editor.view.updateState(EditorState.create({ schema: editor.schema, doc, plugins: editor.state.plugins }));
                        modelValue.current = source;
                        current.current.onSelectionChange?.(null);
                        setInsert(null);
                        refreshSnapshot((version) => version + 1);
                    } finally {
                        syncing.current = false;
                    }
                }
            }
        } catch {
            issue = "This Markdown could not be loaded safely. Continue editing the unchanged source.";
        }
        setError(issue ?? "");
        return !issue;
    }

    // Controlled echoes preserve selection/history. A real external replacement resets history.
    // Run after every render so a caller that rejects onChange also restores the controlled value.
    useLayoutEffect(() => {
        if (!editor || mode !== "rich" || modelValue.current === value) return;
        if (!loadMarkdown(value)) setMode("source");
    });
    useEffect(() => {
        if (!editor) return;
        editor.setEditable(!disabled && !readOnly, false);
        editor.setOptions({
            editorProps: {
                ...editor.options.editorProps,
                attributes: {
                    id: `${id}-rich`,
                    role: "textbox",
                    "aria-multiline": "true",
                    "aria-label": label,
                    "aria-describedby": `${id}-help`,
                    "aria-readonly": String(readOnly),
                    "aria-disabled": String(disabled),
                    tabindex: disabled ? "-1" : "0",
                    class: slots.content,
                },
            },
        });
        if (disabled || readOnly) setInsert(null);
    }, [editor, disabled, readOnly, id, label]);
    useLayoutEffect(() => {
        if (!editor || mode !== "rich") return;
        // Tiptap prevents read-only task changes but does not disable/name that state.
        for (const checkbox of editor.view.dom.querySelectorAll<HTMLInputElement>('li[data-type="taskItem"] input[type="checkbox"]')) {
            checkbox.disabled = disabled || readOnly;
            checkbox.setAttribute("aria-readonly", String(readOnly));
        }
    }, [editor, disabled, readOnly, value, mode]);
    useLayoutEffect(() => {
        if (!pendingViewFocus.current) return;
        pendingViewFocus.current = false;
        if (mode === "source") sourceInput.current?.focus();
        else if (editor && !editor.isDestroyed) editor.view.focus();
    }, [editor, mode]);
    useEffect(() => {
        if (insert) urlInput.current?.focus();
    }, [insert]);

    function changeMode(next: RichTextEditorMode) {
        if (next === mode) return;
        if (next === "rich" && (!editor || (modelValue.current !== value && !loadMarkdown(value)))) return;
        pendingViewFocus.current = true;
        setMode(next);
        setInsert(null);
        current.current.onSelectionChange?.(null);
    }
    function beginInsert(next: "link" | "image") {
        if (!editor) return;
        insertionRange.current = { from: editor.state.selection.from, to: editor.state.selection.to };
        setInsert(next);
        setUrl(next === "link" ? String(editor.getAttributes("link").href ?? "") : "");
        setImageAlt("");
        setInsertError("");
    }
    function focusedChain() {
        // Tiptap's focus command defers DOM focus to an animation frame. Restore
        // it now so keystrokes immediately after a toolbar action reach the editor.
        if (!editor || editor.isDestroyed) return;
        editor.view.focus();
        return editor.chain();
    }
    const locked = disabled || readOnly;
    function applyInsert() {
        if (!editor || !insert || locked) return;
        if (!safeRichTextUrl(url, insert === "image")) {
            setInsertError("Enter an absolute allowed URL without credentials or whitespace.");
            return;
        }
        if (insert === "image" && !imageAlt.trim()) {
            setInsertError("Describe the image with alternative text.");
            return;
        }
        editor.view.focus();
        const chain = editor.chain().setTextSelection(insertionRange.current);
        const success =
            insert === "image"
                ? chain.setImage({ src: url, alt: imageAlt.trim() }).run()
                : insertionRange.current.from === insertionRange.current.to
                  ? chain.insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href: url } }] }).run()
                  : chain.extendMarkRange("link").setLink({ href: url }).run();
        if (success) setInsert(null);
    }
    const toolbarDisabled = locked || !editor;
    const heading = editor?.isActive("heading") ? String(editor.getAttributes("heading").level) : "paragraph";
    return (
        <div
            {...props}
            id={id}
            ref={ref}
            data-component="rich-text-editor"
            aria-disabled={disabled || undefined}
            className={css(richTextEditorStyles.className({}), className)}
        >
            <div className={slots.label}>{label}</div>
            {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
            <div className={slots.modes} role="group" aria-label={`${label} view`}>
                <Button size="small" theme="neutral" disabled={disabled || !editor} aria-pressed={mode === "rich"} onClick={() => changeMode("rich")}>
                    Rich text
                </Button>
                <Button size="small" theme="neutral" disabled={disabled} aria-pressed={mode === "source"} onClick={() => changeMode("source")}>
                    Markdown source
                </Button>
            </div>
            {error && (
                <Alert theme="warn" title="Content preserved">
                    {error}
                </Alert>
            )}
            <p id={`${id}-help`} className={slots.help}>
                Markdown is the saved format. Switching views does not change it. A rich-text edit normalizes Markdown syntax. Raw HTML stays
                source-only. Images load only when you choose Load image.
            </p>
            {mode === "source" ? (
                <Textarea
                    ref={sourceInput}
                    id={`${id}-source`}
                    title={`${label} — Markdown source`}
                    className={slots.source}
                    rows={16}
                    value={value}
                    disabled={disabled}
                    readOnly={readOnly}
                    maxLength={maxLength}
                    aria-describedby={`${id}-help`}
                    onChange={(event) => {
                        if (locked) return;
                        setError("");
                        current.current.onSelectionChange?.(null);
                        onChange(event.target.value);
                    }}
                    onSelect={(event) =>
                        current.current.onSelectionChange?.(
                            sourceRichTextSelection(value, event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
                        )
                    }
                />
            ) : (
                <>
                    <div className={slots.toolbar} role="group" aria-label={`${label} formatting`}>
                        <Select
                            title="Text style"
                            size="small"
                            required
                            options={[
                                { value: "paragraph", label: "Paragraph" },
                                ...([1, 2, 3, 4, 5, 6] as const).map((level) => ({ value: String(level), label: `Heading ${level}` })),
                            ]}
                            value={heading}
                            disabled={toolbarDisabled}
                            onChange={(event) => {
                                const level = Number(event.target.value);
                                if (level >= 1 && level <= 6)
                                    focusedChain()
                                        ?.setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                                        .run();
                                else focusedChain()?.setParagraph().run();
                            }}
                        />
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("bold") ?? false}
                            onClick={() => focusedChain()?.toggleBold().run()}
                        >
                            Bold
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("italic") ?? false}
                            onClick={() => focusedChain()?.toggleItalic().run()}
                        >
                            Italic
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("strike") ?? false}
                            onClick={() => focusedChain()?.toggleStrike().run()}
                        >
                            Strike
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("bulletList") ?? false}
                            onClick={() => focusedChain()?.toggleBulletList().run()}
                        >
                            Bullet list
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("orderedList") ?? false}
                            onClick={() => focusedChain()?.toggleOrderedList().run()}
                        >
                            Numbered list
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("taskList") ?? false}
                            onClick={() => focusedChain()?.toggleTaskList().run()}
                        >
                            Checklist
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("blockquote") ?? false}
                            onClick={() => focusedChain()?.toggleBlockquote().run()}
                        >
                            Quote
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("code") ?? false}
                            onClick={() => focusedChain()?.toggleCode().run()}
                        >
                            Inline code
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled}
                            aria-pressed={editor?.isActive("codeBlock") ?? false}
                            onClick={() => focusedChain()?.toggleCodeBlock().run()}
                        >
                            Code block
                        </Button>
                        <Button size="small" theme="neutral" disabled={toolbarDisabled} onClick={() => beginInsert("link")}>
                            Link
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled || !editor?.isActive("link")}
                            onClick={() => focusedChain()?.extendMarkRange("link").unsetLink().run()}
                        >
                            Unlink
                        </Button>
                        <Button size="small" theme="neutral" disabled={toolbarDisabled} onClick={() => beginInsert("image")}>
                            Image
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled || editor?.isActive("table")}
                            onClick={() => focusedChain()?.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        >
                            Insert table
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled || !editor?.can().undo()}
                            onClick={() => focusedChain()?.undo().run()}
                        >
                            Undo
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={toolbarDisabled || !editor?.can().redo()}
                            onClick={() => focusedChain()?.redo().run()}
                        >
                            Redo
                        </Button>
                    </div>
                    {editor?.isActive("table") && (
                        <div className={slots.toolbar} role="group" aria-label="Table editing">
                            <Button size="small" theme="neutral" disabled={locked} onClick={() => focusedChain()?.addRowAfter().run()}>
                                Add row
                            </Button>
                            <Button size="small" theme="neutral" disabled={locked} onClick={() => focusedChain()?.addColumnAfter().run()}>
                                Add column
                            </Button>
                            <Button size="small" theme="neutral" disabled={locked} onClick={() => focusedChain()?.deleteRow().run()}>
                                Delete row
                            </Button>
                            <Button size="small" theme="neutral" disabled={locked} onClick={() => focusedChain()?.deleteColumn().run()}>
                                Delete column
                            </Button>
                            <Button size="small" theme="ghost-danger" disabled={locked} onClick={() => focusedChain()?.deleteTable().run()}>
                                Delete table
                            </Button>
                        </div>
                    )}
                    {insert && (
                        <div className={slots.fields} role="group" aria-label={insert === "image" ? "Insert image" : "Edit link"}>
                            <Input
                                ref={urlInput}
                                title={insert === "image" ? "Image URL (HTTP or HTTPS)" : "Link URL (HTTP, HTTPS or mailto)"}
                                value={url}
                                disabled={locked}
                                error={insertError || undefined}
                                onChange={(event) => setUrl(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        applyInsert();
                                    }
                                    if (event.key === "Escape") {
                                        event.preventDefault();
                                        setInsert(null);
                                        editor?.view.focus();
                                    }
                                }}
                            />
                            {insert === "image" && (
                                <Input
                                    title="Image alternative text"
                                    value={imageAlt}
                                    disabled={locked}
                                    onChange={(event) => setImageAlt(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            applyInsert();
                                        }
                                        if (event.key === "Escape") {
                                            event.preventDefault();
                                            setInsert(null);
                                            editor?.view.focus();
                                        }
                                    }}
                                />
                            )}
                            {insert === "image" && (
                                <p className={slots.help}>
                                    A URL reference, not an upload. Loading an image contacts its host and may disclose your IP address.
                                </p>
                            )}
                            <div className={slots.modes}>
                                <Button size="small" theme="primary" disabled={locked} onClick={applyInsert}>
                                    {insert === "image" ? "Insert image" : "Apply link"}
                                </Button>
                                <Button
                                    size="small"
                                    theme="neutral"
                                    onClick={() => {
                                        setInsert(null);
                                        editor?.view.focus();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                    {!editor && (
                        <p className={slots.content} role="status">
                            Loading rich-text editor…
                        </p>
                    )}
                    <EditorContent editor={editor} />
                </>
            )}
        </div>
    );
});
