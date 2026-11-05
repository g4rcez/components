import { Editor } from "@tiptap/core";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { RichTextEditor } from "../src/components/form/rich-text-editor/rich-text-editor";
import {
    markdownEquivalent,
    markdownSafetyIssue,
    richTextDocumentsEquivalent,
    safeRichTextDocument,
    safeRichTextUrl,
    sanitizeRichTextPaste,
    sourceRichTextSelection,
} from "../src/components/form/rich-text-editor/rich-text-markdown";

function Controlled({ initial = "Hello", changed = () => {} }: { initial?: string; changed?(value: string): void }) {
    const [value, setValue] = useState(initial);
    return (
        <ComponentsProvider>
            <RichTextEditor
                label="Note"
                value={value}
                onChange={(next) => {
                    changed(next);
                    setValue(next);
                }}
            />
        </ComponentsProvider>
    );
}

describe("RichTextEditor", () => {
    it("preserves original source bytes on mount and round-trip mode changes", async () => {
        const changed = vi.fn();
        const source = "## Note\r\n\r\n__Bold__ and *italic*\r\n";
        render(<Controlled initial={source} changed={changed} />);
        await screen.findByRole("textbox", { name: "Note" });
        await waitFor(() => expect(screen.getByRole("combobox", { name: "Text style" })).toHaveValue("2"));
        fireEvent.click(screen.getByRole("button", { name: "Markdown source" }));
        // Native textarea presentation normalizes CRLF; controlled source must not emit a rewrite.
        expect(screen.getByRole("textbox", { name: "Note — Markdown source" })).toHaveValue(source.replace(/\r\n/gu, "\n"));
        fireEvent.click(screen.getByRole("button", { name: "Rich text" }));
        expect(changed).not.toHaveBeenCalled();
    });

    it("emits a Markdown edit for formatting, supports undo/redo, and mirrors source", async () => {
        const changed = vi.fn();
        render(<Controlled changed={changed} />);
        await screen.findByRole("textbox", { name: "Note" });
        fireEvent.change(screen.getByRole("combobox", { name: "Text style" }), { target: { value: "2" } });
        await waitFor(() => expect(changed).toHaveBeenLastCalledWith("## Hello"));
        fireEvent.click(screen.getByRole("button", { name: "Undo" }));
        await waitFor(() => expect(changed).toHaveBeenLastCalledWith("Hello"));
        fireEvent.click(screen.getByRole("button", { name: "Redo" }));
        await waitFor(() => expect(changed).toHaveBeenLastCalledWith("## Hello"));
        fireEvent.click(screen.getByRole("button", { name: "Markdown source" }));
        expect(screen.getByRole("textbox", { name: "Note — Markdown source" })).toHaveValue("## Hello");
    });

    it("edits real checklist state as Markdown", async () => {
        const changed = vi.fn();
        render(<Controlled initial={"- [ ] Review"} changed={changed} />);
        const checkbox = await screen.findByRole("checkbox", { name: "Task: Review" });
        fireEvent.click(checkbox);
        await waitFor(() => expect(changed).toHaveBeenLastCalledWith("- [x] Review"));
    });

    it("returns keyboard focus before a checklist toolbar action finishes", async () => {
        const changed = vi.fn();
        render(<Controlled changed={changed} />);
        const editor = await screen.findByRole("textbox", { name: "Note" });
        const button = screen.getByRole("button", { name: "Checklist" });
        button.focus();
        fireEvent.click(button);
        // Do not wait for an animation frame: the next keystroke must not land
        // on the toolbar button while Tiptap schedules its asynchronous focus.
        expect(editor).toHaveFocus();
        expect(changed).toHaveBeenLastCalledWith("- [ ] Hello");
    });

    it("focuses each destination during the committed view switch", async () => {
        render(<Controlled />);
        await screen.findByRole("textbox", { name: "Note" });
        const sourceButton = screen.getByRole("button", { name: "Markdown source" });
        sourceButton.focus();
        fireEvent.click(sourceButton);
        expect(screen.getByRole("textbox", { name: "Note — Markdown source" })).toHaveFocus();
        const richButton = screen.getByRole("button", { name: "Rich text" });
        richButton.focus();
        fireEvent.click(richButton);
        expect(screen.getByRole("textbox", { name: "Note" })).toHaveFocus();
    });

    it("inserts serializable GFM tables with editable rows and columns", async () => {
        const changed = vi.fn();
        render(<Controlled changed={changed} />);
        await screen.findByRole("textbox", { name: "Note" });
        fireEvent.click(screen.getByRole("button", { name: "Insert table" }));
        await waitFor(() => expect(screen.getByRole("button", { name: "Add row" })).toBeEnabled());
        expect(changed.mock.calls.at(-1)?.[0]).toMatch(/\|/u);
        expect(changed.mock.calls.at(-1)?.[0]).not.toMatch(/<table/u);
    });

    it("accepts controlled source edits and reports exact source selection offsets", async () => {
        const selection = vi.fn();
        const changed = vi.fn();
        function Example() {
            const [value, setValue] = useState("Before");
            return (
                <ComponentsProvider>
                    <RichTextEditor
                        label="Note"
                        defaultMode="source"
                        value={value}
                        onChange={(next) => {
                            changed(next);
                            setValue(next);
                        }}
                        onSelectionChange={selection}
                    />
                </ComponentsProvider>
            );
        }
        render(<Example />);
        const source = screen.getByRole("textbox", { name: "Note — Markdown source" }) as HTMLTextAreaElement;
        fireEvent.change(source, { target: { value: "One **two** three" } });
        expect(changed).toHaveBeenLastCalledWith("One **two** three");
        source.focus();
        source.setSelectionRange(6, 9);
        fireEvent.select(source);
        expect(selection).toHaveBeenLastCalledWith({ mode: "source", from: 6, to: 9, text: "two", value: "One **two** three" });
        fireEvent.click(screen.getByRole("button", { name: "Rich text" }));
        await waitFor(() => expect(screen.getByRole("textbox", { name: "Note" })).toHaveTextContent("One two three"));
        expect(changed).toHaveBeenCalledTimes(1);
    });

    it("keeps unsafe and unrepresentable input editable as exact source without rendering HTML", async () => {
        const changed = vi.fn();
        const source = "<script>alert(1)</script>\n\n![unsafe](data:image/svg+xml,evil)";
        const { container } = render(<Controlled initial={source} changed={changed} />);
        await waitFor(() => expect(screen.getByRole("textbox", { name: "Note — Markdown source" })).toHaveValue(source));
        fireEvent.click(screen.getByRole("button", { name: "Rich text" }));
        expect(container.querySelector("script, img")).toBeNull();
        expect(changed).not.toHaveBeenCalled();
    });

    it("updates external controlled values without offering undo into another snapshot", async () => {
        const changed = vi.fn();
        const { rerender } = render(
            <ComponentsProvider>
                <RichTextEditor label="Note" value="First" onChange={changed} />
            </ComponentsProvider>
        );
        await screen.findByRole("textbox", { name: "Note" });
        rerender(
            <ComponentsProvider>
                <RichTextEditor label="Note" value="Second" onChange={changed} />
            </ComponentsProvider>
        );
        await waitFor(() => expect(screen.getByRole("textbox", { name: "Note" })).toHaveTextContent("Second"));
        expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
        expect(changed).not.toHaveBeenCalled();
    });

    it("rejects a rich edit when the controlled owner does not accept onChange", async () => {
        const changed = vi.fn();
        render(
            <ComponentsProvider>
                <RichTextEditor label="Note" value="Kept" onChange={changed} />
            </ComponentsProvider>
        );
        await screen.findByRole("textbox", { name: "Note" });
        fireEvent.change(screen.getByRole("combobox", { name: "Text style" }), { target: { value: "2" } });
        await waitFor(() => expect(changed).toHaveBeenCalledWith("## Kept"));
        await waitFor(() => expect(screen.getByRole("combobox", { name: "Text style" })).toHaveValue("paragraph"));
    });

    it("does not eagerly request image URLs and read-only disables formatting", async () => {
        const changed = vi.fn();
        const { container } = render(
            <ComponentsProvider>
                <RichTextEditor label="Note" readOnly value="![A diagram](https://example.com/diagram.png)" onChange={changed} />
            </ComponentsProvider>
        );
        await screen.findByRole("button", { name: "Load image" });
        expect(container.querySelector("img")).toBeNull();
        expect(screen.getByRole("textbox", { name: "Note" })).toHaveAttribute("contenteditable", "false");
        expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: "Markdown source" }));
        expect(screen.getByRole("textbox", { name: "Note — Markdown source" })).toHaveAttribute("readonly");
        expect(changed).not.toHaveBeenCalled();
    });
    it("does not assign a fetching image URL during node-view attachment or mode switches", async () => {
        const url = "https://example.com/private-image.png";
        const assigned: string[] = [];
        const setAttribute = Element.prototype.setAttribute;
        const spy = vi.spyOn(Element.prototype, "setAttribute").mockImplementation(function (this: Element, name, value) {
            if (this instanceof HTMLImageElement && name === "src") assigned.push(value);
            return setAttribute.call(this, name, value);
        });
        try {
            render(<Controlled initial={`![Private diagram](${url})`} />);
            await screen.findByRole("button", { name: "Load image" });
            fireEvent.click(screen.getByRole("button", { name: "Markdown source" }));
            fireEvent.click(screen.getByRole("button", { name: "Rich text" }));
            await screen.findByRole("button", { name: "Load image" });
            expect(assigned).toEqual([]);
            fireEvent.click(screen.getByRole("button", { name: "Load image" }));
            expect(await screen.findByRole("img", { name: "Private diagram" })).toHaveAttribute("src", url);
            expect(assigned).toEqual([url]);
        } finally {
            spy.mockRestore();
        }
    });
});

describe("Markdown safety and representation", () => {
    it.each([
        "javascript:alert(1)",
        "data:image/png;base64,AA",
        "file:///etc/passwd",
        "//example.com/a",
        "https://name:secret@example.com/a",
        "https://example.com/\nscript",
    ])("rejects unsafe or ambiguous URL %s", (value) => {
        expect(safeRichTextUrl(value)).toBe(false);
        expect(safeRichTextUrl(value, true)).toBe(false);
    });
    it("permits absolute web URLs and link-only mailto", () => {
        expect(safeRichTextUrl("https://example.com/a.png", true)).toBe(true);
        expect(safeRichTextUrl("mailto:person@example.com")).toBe(true);
        expect(safeRichTextUrl("mailto:person@example.com", true)).toBe(false);
        expect(markdownSafetyIssue("```html\n<script>inert</script>\n```\n\n**Safe**")).toBeNull();
    });
    it("sanitizes clipboard HTML including event handlers, styles and obfuscated schemes", () => {
        const html = sanitizeRichTextPaste(
            '<p onclick="evil()" style="color:red">Keep <strong>bold</strong></p><script>evil()</script><a href="jav&#x61;script:evil()">No</a><img src="data:image/svg+xml,evil" alt="description"><iframe src="https://example.com"></iframe>'
        );
        expect(html).toContain("<strong>bold</strong>");
        expect(html).toContain("description");
        expect(html).not.toMatch(/onclick|style=|<script|javascript:|<img|<iframe/u);
        expect(
            safeRichTextDocument({
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: "unsafe", marks: [{ type: "link", attrs: { href: "javascript:evil()" } }] }],
                    },
                ],
            })
        ).toBe(false);
    });
    it("keeps pasted and copied image URLs inert until a node-view opt-in", () => {
        for (const html of [
            '<img src="https://example.com/private.png" alt="Private">',
            '<img data-rich-text-src="https://example.com/private.png" alt="Private">',
        ]) {
            const container = document.createElement("div");
            container.innerHTML = sanitizeRichTextPaste(html);
            const image = container.querySelector("img");
            expect(image?.getAttribute("src")).toBeNull();
            expect(image?.getAttribute("data-rich-text-src")).toBe("https://example.com/private.png");
            expect(image?.getAttribute("alt")).toBe("Private");
        }
        expect(sanitizeRichTextPaste('<img data-rich-text-src="javascript:evil()" alt="Unsafe">')).toBe("Unsafe");
    });
    it("distinguishes formatting normalization from content loss across GFM structures", () => {
        expect(markdownEquivalent("__bold__\r\n", "**bold**")).toBe(true);
        expect(markdownEquivalent("- [x] Done\n- [ ] Later", "- [ ] Done\n- [ ] Later")).toBe(false);
        expect(markdownEquivalent("| A | B |\n| --- | --- |\n| one | two |", "one two")).toBe(false);
        expect(markdownEquivalent("[x](https://example.com)", "x")).toBe(false);
        expect(markdownEquivalent("![a](https://example.com/a.png)", "![b](https://example.com/a.png)")).toBe(false);
    });
    it("allows blank editing space but rejects dropped meaningful blocks", () => {
        const paragraph = { type: "paragraph", content: [{ type: "text", text: "A" }] };
        expect(richTextDocumentsEquivalent({ type: "doc", content: [paragraph, { type: "paragraph" }] }, { type: "doc", content: [paragraph] })).toBe(
            true
        );
        expect(richTextDocumentsEquivalent({ type: "doc", content: [paragraph, paragraph] }, { type: "doc", content: [paragraph] })).toBe(false);
    });
    it.each([
        [" bold", "Before **bold**"],
        ["bold ", "Before**bold** "],
        [" bold ", "Before **bold** "],
        [" ", "Before "],
    ])("accepts emphasis boundary typing %j without dropping source spaces", (typed, expected) => {
        const editor = new Editor({
            extensions: [StarterKit.configure({ underline: false, trailingNode: false }), Markdown],
            content: "Before",
            contentType: "markdown",
        });
        try {
            editor.commands.setTextSelection(editor.state.doc.content.size - 1);
            editor.commands.toggleBold();
            editor.view.dispatch(editor.state.tr.insertText(typed));
            const source = editor.getMarkdown();
            expect(source).toBe(expected);
            expect(editor.state.doc.textContent).toBe(`Before${typed}`);
            const roundTrip = editor.schema.nodeFromJSON(editor.markdown!.parse(source));
            expect(richTextDocumentsEquivalent(editor.getJSON(), roundTrip.toJSON())).toBe(true);
        } finally {
            editor.destroy();
        }
    });
    it("retains meaningful text, code/link whitespace, marks and inner strike spaces", () => {
        const document = (content: Parameters<typeof richTextDocumentsEquivalent>[0][]) => ({
            type: "doc",
            content: [{ type: "paragraph", content }],
        });
        const text = (value: string, type?: string) => ({ type: "text", text: value, ...(type ? { marks: [{ type }] } : {}) });
        expect(richTextDocumentsEquivalent(document([text("A B")]), document([text("AB")]))).toBe(false);
        expect(richTextDocumentsEquivalent(document([text("bold", "bold")]), document([text("bold")]))).toBe(false);
        expect(richTextDocumentsEquivalent(document([text(" code ", "code")]), document([text("code", "code")]))).toBe(false);
        expect(richTextDocumentsEquivalent(document([text(" link ", "link")]), document([text("link", "link")]))).toBe(false);
        expect(
            richTextDocumentsEquivalent(
                document([text("A", "strike"), text(" ", "strike"), text("B", "strike")]),
                document([text("A", "strike"), text(" "), text("B", "strike")])
            )
        ).toBe(false);
        expect(
            richTextDocumentsEquivalent(
                { type: "doc", content: [{ type: "codeBlock", content: [text(" code ")] }] },
                { type: "doc", content: [{ type: "codeBlock", content: [text("code")] }] }
            )
        ).toBe(false);
    });
    it("normalizes source selections without fabricating an offset range", () => {
        expect(sourceRichTextSelection("abc", -10, 100)).toEqual({ mode: "source", text: "abc", from: 0, to: 3, value: "abc" });
        expect(sourceRichTextSelection("abc", 2, 2)).toBeNull();
        expect(sourceRichTextSelection("A\r\nB\r\nC", 2, 5)).toEqual({ mode: "source", text: "B\r\nC", from: 3, to: 7, value: "A\r\nB\r\nC" });
    });
});
