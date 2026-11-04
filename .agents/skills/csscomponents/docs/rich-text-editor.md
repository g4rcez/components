---
title: RichTextEditor
description: Controlled GFM Markdown editing with a safe rich view and an exact source view.
package: "@g4rcez/components"
export: "{ RichTextEditor }"
import: "import { RichTextEditor } from '@g4rcez/components/rich-text-editor'"
category: form
---

# RichTextEditor

Use for Markdown notes and living documents. Do not use for arbitrary HTML, Word layouts, executable code, binary uploads, or lossless editing of every Markdown dialect.

## Import and CSS

```tsx
import { RichTextEditor, type RichTextSelection } from "@g4rcez/components/rich-text-editor";
import "@g4rcez/components/foundation.css";
import "@g4rcez/components/button.css";
import "@g4rcez/components/input.css";
import "@g4rcez/components/select.css";
import "@g4rcez/components/alert.css";
import "@g4rcez/components/collapse.css";
import "@g4rcez/components/resizable.css";
import "@g4rcez/components/rich-text-editor.css";
```

Component style dependencies: `button`, `input`, `textarea`, `select`, `alert`, `resizable`. Textarea shares input.css; Resizable is included explicitly for Alert's Collapse composition. Load collapse.css alongside the existing Alert integration. The style manifest resolves the registered dependency closure. Use the existing ComponentsProvider setup.

Runtime dependencies are Tiptap v3 (`core`, `pm`, `react`, `starter-kit`, `markdown`, `extension-image`, `extension-list`, `extension-table`), DOMPurify and marked. The editor does not execute, inject, or preview source HTML.

## Controlled example

```tsx
const [markdown, setMarkdown] = useState("# Review\n\n- [ ] Write notes");
const [selection, setSelection] = useState<RichTextSelection | null>(null);
<RichTextEditor
  label="Meeting notes"
  name="content"
  value={markdown}
  onChange={setMarkdown}
  onSelectionChange={setSelection}
/>;
// Only use context when selection?.value === the document snapshot being acted on.
```

## Props

| Prop | Type | Default | Behavior |
| --- | --- | --- | --- |
| `label` | `string` | required | Visible title and accessible rich textbox name; source has an additional Markdown source label. |
| `value` | `string` | required | Authoritative Markdown source, never HTML. |
| `onChange` | `(markdown: string) => void` | required | Emitted for accepted user edits only. The parent must synchronously update its controlled state. |
| `disabled` | `boolean` | `false` | Disables editing, formatting and view controls; rich textbox is removed from sequential focus. Pass explicitly when disabling an ancestor fieldset: contenteditable does not inherit native fieldset disabling. |
| `readOnly` | `boolean` | `false` | Formatting and editing are disabled, selection and view switching remain available. |
| `defaultMode` | `'rich' \| 'source'` | `'rich'` | Initial requested view; unsupported rich input opens exact source instead. |
| `maxLength` | `number` | — | Source character bound for native source editing and accepted rich transactions. Not a UTF-8 byte limit; enforce application storage limits separately. |
| `name` | `string` | — | Includes the controlled source in a hidden form field; omitted when disabled. |
| `onSelectionChange` | `(selection: RichTextSelection \| null) => void` | — | Selection text, mode, range and exact `value` snapshot. Cleared by edits/view changes/external replacements. |
| `id`, `className`, native div attributes | — | — | Root attributes; forwarded ref points to root div. |

`RichTextSelection` has `{ mode, text, from, to, value }`. Source `from`/`to` are UTF-16 Markdown offsets. Rich positions are **ProseMirror document positions**, not source offsets. Never slice Markdown with a rich range. Selection is context, not permission or a patch-application API. Revalidate the exact snapshot and document/revision ownership before using it for AI or writes.

## Formatting and keyboard behavior

- Heading levels 1–6, paragraphs, bold, italic, strike, bullet/numbered lists, nested checklists, blockquotes, inline code and fenced code blocks.
- Insert/edit links; unlink; insert URL images with required alternative text. Existing Markdown image alt text is preserved even when empty.
- GFM tables with a header row; add/delete rows and columns, delete table, navigate cells with Tab/Shift+Tab. Cell merging, arbitrary HTML layout, multiple paragraphs in a cell and non-Markdown attributes are not supported.
- Undo/redo buttons and standard Tiptap shortcuts: Mod+B, Mod+I, Mod+Z, Mod+Shift+Z (platform-specific redo variants are owned by Tiptap). Source uses the browser's text editing/undo behavior. Histories are not one cross-mode global history: unchanged view switches retain rich history; source changes and external controlled replacements establish a fresh rich history so Undo cannot resurrect another revision.
- Formatting actions are an ordinary labelled button group, not an ARIA toolbar requiring arrow navigation. Tab reaches each action. Buttons expose pressed state for active marks/lists/quotes/code. Escape closes URL entry and returns to the editor; Cancel does the same. View changes focus the destination editor.
- Task checkboxes announce their task text. Read-only does not supply Tiptap's read-only toggle callback, so tasks cannot change. No custom editor animation is authored.

## Source fidelity and failure behavior

Mounting, switching views and accepting a controlled echo never call `onChange`. The original source—including CRLF, delimiters, reference syntax and trailing blanks—stays byte-for-byte in `value` until a real edit. A rich edit serializes canonical GFM and may normalize delimiter style, whitespace, line endings and reference-link spelling. The help text discloses this before editing.

Before loading rich content, a separate marked token comparison checks parse/serialize semantic equivalence. Raw HTML, unsafe URLs, parser failures and unsupported structures keep the source intact and show an Alert. There is **no** “best effort” conversion silently dropping content and no automatic destructive conversion action. Continue in source view for unsupported dialects or malformed input. The conservative gate may reject valid but unsupported Markdown; it is not a Markdown validator.

Each rich document transaction is checked for safe URLs and structural round-trip equivalence through the installed Markdown serializer/schema. Changes that would lose meaningful blocks, table structure or formatting are refused with recoverable feedback. Empty paragraphs are editing space, not meaningful Markdown content. Source editing remains available. Rich mode is client initialized; server rendering shows its loading state rather than trying to instantiate a browser editor.

## Trust and privacy boundaries

- Markdown is never passed to `dangerouslySetInnerHTML`. It is parsed to a constrained ProseMirror schema; React node views render image placeholders as escaped text.
- Clipboard HTML is sanitized by DOMPurify with an explicit element/attribute allowlist, then parsed through the editor schema. Scripts, handlers, inline styles, embeds, data/blob/file URLs, URL credentials and unsupported attributes are removed. Plain text paste stays text, not HTML. Pasted/dropped files are refused with an explanation; there is no hidden uploader.
- Allowed links are absolute `http:`, `https:` and `mailto:`. Images allow absolute `http:`/`https:` only. Relative URLs, protocol-relative URLs, data images, executable schemes and credential-bearing URLs are rejected. Source can retain these strings but cannot enter rich view while they are present.
- Remote image references **do not load automatically**, including on read-only initial content. A per-image Load image action opts into a request with `referrerPolicy="no-referrer"`; the remote host still receives network information such as IP address and may return redirects. The component is not a network proxy or host/DNS safety service. Safe preview consumers may choose not to load images at all.
- Sanitization governs the editor DOM, not exported source opened in another application. Validate persistent content, authorization, byte limits, revision staleness and any downstream HTML/export renderer at their own boundaries.

## Tokens and selectors

The component uses canonical foundation colors (`--var-color-background`, `foreground`, `border`, `primary`, `primary-foreground`, `muted`, `muted-foreground`), spacing and radius tokens. Public scoped geometry overrides:

| Token | Default |
| --- | --- |
| `--var-rich-text-editor-gap` | `calc(var(--var-spacing-base) * 0.75)` |
| `--var-rich-text-editor-min-height` | `20rem` |
| `--var-rich-text-editor-padding` | `var(--var-spacing-base)` |
| `--var-rich-text-editor-radius` | `calc(var(--var-radius-base) / 2)` |
| `--var-rich-text-editor-font-size` | `1rem` |

Root: `.__rich-text-editor` / `[data-component="rich-text-editor"]`. Slots: `label`, `modes`, `toolbar`, `content`, `source`, `fields`, `help`, `image`, `image-content` under `.__rich-text-editor__*`. The library owns editor prose, tables, checkbox presentation, selected cells and image placeholders. Consumers should use tokens rather than private Tiptap internals. The layout wraps actions and constrains content; code/table content can scroll horizontally. Forced-colors focus uses Highlight.
