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

- Style dependencies: `button`, `input`, `textarea`, `select`, `alert`, `resizable`. The style manifest resolves the dependency closure.
- Textarea shares input.css. Resizable serves Alert's Collapse composition, so load collapse.css with the Alert integration.
- Use the existing ComponentsProvider setup.
- Runtime dependencies: Tiptap v3 (`core`, `pm`, `react`, `starter-kit`, `markdown`, `extension-image`, `extension-list`, `extension-table`), DOMPurify, marked.
- The editor never executes, injects, or previews source HTML.
- The public stylesheet owns whitespace, separator, gap-cursor and selection styles. Tiptap runtime CSS injection is off, so hosts keep `style-src 'self'` with no inline `<style>`, nonce or hash.
- The gap cursor is static, not blinking.

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
| `label` | `string` | required | Visible title and rich textbox name. Source view adds a Markdown source label. |
| `value` | `string` | required | Authoritative Markdown source, never HTML. |
| `onChange` | `(markdown: string) => void` | required | Emitted for accepted user edits only. Parent MUST update state synchronously. |
| `disabled` | `boolean` | `false` | Disables editing, formatting and view controls. Rich textbox leaves sequential focus. |
| `readOnly` | `boolean` | `false` | Disables formatting and editing. Selection and view switching stay on. |
| `defaultMode` | `'rich' \| 'source'` | `'rich'` | Initial view. Unsupported rich input opens exact source. |
| `maxLength` | `number` | — | Source character bound for source edits and accepted rich transactions. Not a UTF-8 byte limit. |
| `name` | `string` | — | Adds the controlled source to a hidden form field. Omitted when disabled. |
| `onSelectionChange` | `(selection: RichTextSelection \| null) => void` | — | Reports selection text, mode, range and exact `value` snapshot. Edits, view changes, external replacements clear it. |
| `id`, `className`, native div attributes | — | — | Root attributes. Forwarded ref points to the root div. |

- Pass `disabled` explicitly when you disable an ancestor fieldset. Contenteditable ignores native fieldset disabling.
- Enforce storage limits separately from `maxLength`.
- `RichTextSelection` is `{ mode, text, from, to, value }`. Source `from`/`to` are UTF-16 Markdown offsets.
- Rich positions are **ProseMirror document positions**, not source offsets. Never slice Markdown with a rich range.
- Selection is context, not permission or a patch API. Before AI use or writes, revalidate the exact snapshot and the document/revision ownership.

## Formatting and keyboard behavior

- Supported: heading levels 1–6, paragraphs, bold, italic, strike, bullet/numbered lists, nested checklists, blockquotes, inline code, fenced code blocks.
- Links: insert, edit, unlink. Images: insert by URL with required alternative text. Existing Markdown image alt text stays, even when empty.
- GFM tables need a header row. Add/delete rows and columns, delete table, move between cells with Tab/Shift+Tab.
- Tables do not support cell merging, arbitrary HTML layout, multiple paragraphs in a cell, or non-Markdown attributes.
- Undo/redo buttons and Tiptap shortcuts: Mod+B, Mod+I, Mod+Z, Mod+Shift+Z. Tiptap owns platform-specific redo variants. Source view uses browser undo.
- There is no global history across modes. An unchanged view switch keeps rich history. Source changes and external controlled replacements start fresh rich history, so Undo cannot restore another revision.
- Formatting actions are a labelled button group, not an ARIA toolbar. Tab reaches each action. Buttons expose pressed state for active marks, lists, quotes and code.
- Formatting and table actions restore editor focus synchronously, so typing right after activation is not lost.
- Escape or Cancel closes URL entry and returns to the editor. A view change focuses the destination editor.
- Task checkboxes announce their task text. Read-only mode omits Tiptap's read-only toggle callback, so tasks cannot change.
- The editor authors no custom animation.

## Source fidelity and failure behavior

- Mounting, switching views and accepting a controlled echo never call `onChange`.
- `value` keeps the original source byte-for-byte until a real edit, including CRLF, delimiters, reference syntax and trailing blanks.
- A rich edit serializes canonical GFM. It can normalize delimiter style, whitespace, line endings and reference-link spelling. The help text states this before editing.
- Before loading rich content, a separate marked token comparison checks parse/serialize semantic equivalence.
- Raw HTML, unsafe URLs, parser failures and unsupported structures keep the source intact and show an Alert.
- There is **no** "best effort" conversion that silently drops content, and no automatic destructive conversion. Continue in source view for unsupported dialects or malformed input.
- The conservative gate can reject valid but unsupported Markdown. It is not a Markdown validator.
- Each rich transaction is checked for safe URLs and structural round-trip equivalence through the installed Markdown serializer/schema. The editor refuses changes that lose meaningful blocks, table structure or formatting, with recoverable feedback.
- Bold/italic/strike run-edge spaces are compared outside their delimiters, as the serializer does.
- Paragraph/heading-edge editing spaces stay in serialized source, although Markdown parsing omits them.
- Internal text spaces, code/link-marked whitespace and meaningful marks stay distinct. Empty paragraphs are editing space, not Markdown content.
- Rich mode initializes on the client. Server rendering shows the loading state.

## Trust and privacy boundaries

- Markdown never reaches `dangerouslySetInnerHTML`. It parses to a constrained ProseMirror schema. React node views render image placeholders as escaped text.
- DOMPurify sanitizes clipboard HTML with an explicit element/attribute allowlist. The editor schema then parses it.
- Sanitizing removes scripts, handlers, inline styles, embeds, data/blob/file URLs, URL credentials and unsupported attributes.
- Plain text paste stays text. Pasted or dropped files are refused with an explanation. There is no hidden uploader.
- Allowed links: absolute `http:`, `https:`, `mailto:`. Allowed images: absolute `http:`/`https:` only.
- Rejected: relative URLs, protocol-relative URLs, data images, executable schemes, credential-bearing URLs. Source can keep them but cannot enter rich view while they are present.
- Remote image references **do not load automatically**, including during schema-renderer fallback while React node views attach, mode changes, and read-only initial content.
- HTML/clipboard serialization keeps the URL in an inert `data-rich-text-src` attribute, not a fetching `src`. The paste boundary validates and preserves it. Other editors may not recognize this clipboard image form.
- A per-image Load image action opts into a request with `referrerPolicy="no-referrer"`. The remote host still receives network information such as the IP address and can return redirects.
- The component is not a network proxy or host/DNS safety service. A safe preview consumer can skip image loading.
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

- Root: `.__rich-text-editor` / `[data-component="rich-text-editor"]`.
- Slots under `.__rich-text-editor__*`: `label`, `modes`, `toolbar`, `content`, `source`, `fields`, `help`, `image`, `image-content`.
- The library owns editor prose, tables, checkbox presentation, selected cells and image placeholders. Use tokens, not private Tiptap internals.
- The layout wraps actions and constrains content. Code and table content scroll horizontally.
- Forced-colors focus uses Highlight.
