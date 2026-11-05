---
title: FileUpload
description: Drag-and-drop file upload area with file preview, modal viewer, and per-file deletion.
package: "@g4rcez/components"
export: "{ FileUpload }"
import: "import { FileUpload } from '@g4rcez/components/file-upload'"
category: form
---

# FileUpload

Drag-and-drop file upload area with file preview, modal viewer, and per-file deletion.

## Import

```tsx
import { FileUpload } from "@g4rcez/components/file-upload";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `files` | `File[]` | - | Controlled files array. |
| `onDrop` | `(files: File[]) => void` | - | Called when files are dropped or selected. |
| `onDeleteFile` | `(file: File) => void` | - | Called when the delete button of a file item is clicked. |
| `idle` | `React.ReactElement` | Default idle UI | Content when no files exist and the area is not active. |
| `File` | `React.FC<{ file: File }>` | - | Custom component below the name and size row of each file. |
| `accept` | `string \| Record<string, string[]>` | - | Accepted file types. Forwarded to `react-dropzone`. |
| `multiple` | `boolean` | `false` | Allow more than one file. |
| `maxFiles` | `number` | - | Maximum number of files. |
| `maxSize` | `number` | - | Maximum file size in bytes. |
| `disabled` | `boolean` | `false` | Disable the drop zone. |
| `name` | `string` | - | Name for the underlying `<input>`. |
| `...DropzoneProps` | | | All `react-dropzone` props. |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map has the full set. Current plain-CSS geometry examples:

| Override | Library default |
| --- | --- |
| `--var-file-upload-file-icon-size` | `calc(var(--var-spacing-base) * 3)` |
| `--var-file-upload-remove-icon-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-file-upload-idle-icon-size` | `calc(var(--var-spacing-base) * 5)` |
| `--var-file-upload-thumb-icon-size` | `calc(var(--var-spacing-base) * 1.75)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `border-border` | `--var-color-border` | File item separators and default drop zone border |
| `bg-background` | `--var-color-background` | Active drop zone background |
| `text-foreground` | `--var-color-foreground` | General text color |
| `text-primary` | `--var-color-primary` | Idle accent color |
| `text-danger` | `--var-color-danger` | Delete action hover color |

## Drag and Drop States

| State | Description |
| --- | --- |
| Idle (empty) | Shows the `idle` prop, or default singular or plural copy. |
| Drag active | Replaces the idle UI with an open folder icon while dragging. |
| Files present | Shows the file list. The drop zone border becomes solid and the background fills. |

## Default Idle Copy

The default idle content follows `multiple`. Omitted `multiple` and `multiple={false}` give singular wording. `multiple={true}` gives plural wording.

| `multiple` | Prompt | Action |
| --- | --- | --- |
| omitted or `false` | `Arraste seu arquivo para cá ou` | `clique para escolher um arquivo` |
| `true` | `Arraste seus arquivos para cá ou` | `clique para escolher seus arquivos` |

Pass `idle` to replace the default content completely.

## File Type Rendering

The component selects an icon from the file extension:

| Extension(s) | Icon |
| --- | --- |
| csv, xls, xlsx | `SheetIcon` |
| pdf, txt | `FileTextIcon` |
| json | `FileJsonIcon` |
| mp3 | `AudioLinesIcon` |
| mp4, mov | `FileVideo2` |
| Images | Inline `<img>` thumbnail |
| Other | Generic `FileIcon` |

Click a file thumbnail to open a `Modal` viewer. It shows a full-size preview for images, a `<video>` player for videos, and an `<audio>` player for audio files.

## Examples

### Controlled image upload

```tsx
import { FileUpload } from "@g4rcez/components/file-upload";
function ImageUpload() {
    const [images, setImages] = useState<File[]>([]);
    return (
        <FileUpload
            files={images}
            onDrop={(added) => setImages((prev) => [...prev, ...added])}
            onDeleteFile={(file) => setImages((prev) => prev.filter((f) => f !== file))}
            accept="image/*"
            multiple
            maxFiles={10}
            maxSize={5 * 1024 * 1024}
        />
    );
}
```

### Single file upload

```tsx
function AvatarUpload() {
    const [file, setFile] = useState<File | null>(null);
    return (
        <FileUpload
            files={file ? [file] : []}
            onDrop={(files) => setFile(files[0])}
            onDeleteFile={() => setFile(null)}
            accept="image/jpeg,image/png"
            multiple={false}
            maxSize={2 * 1024 * 1024}
        />
    );
}
```

### Custom idle state

```tsx
import { UploadSimpleIcon } from "@phosphor-icons/react";
const CustomIdle = () => (
    <div className="flex flex-col items-center gap-2 py-10">
        {" "}
        <UploadSimpleIcon size={48} className="text-primary" /> <p className="text-foreground font-medium">Drop files here</p>{" "}
        <p className="text-muted-foreground text-sm">PDF, DOCX, up to 10 MB each</p>{" "}
    </div>
);
<FileUpload files={[]} onDrop={setFiles} idle={<CustomIdle />} accept="application/pdf.docx" multiple />;
```

### Custom per-file renderer

```tsx
const ProgressRow = ({ file }: { file: File }) => {
    const progress = useUploadProgress(file);
    return (
        <div className="flex flex-col gap-1 pb-2">
            {" "}
            <div className="flex justify-between text-xs text-muted-foreground">
                {" "}
                <span>{progress < 100 ? "Uploading..." : "Done"}</span> <span>{progress}%</span>{" "}
            </div>{" "}
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                {" "}
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />{" "}
            </div>{" "}
        </div>
    );
};
<FileUpload files={files} onDrop={setFiles} File={ProgressRow} multiple />;
```

### Inside a form

```tsx
import { Form } from "@g4rcez/components/form";
import { Button } from "@g4rcez/components/button";
function SubmissionForm() {
    const [attachments, setAttachments] = useState<File[]>([]);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(e.currentTarget);
        attachments.forEach((f) => data.append("attachments", f));
        submitToServer(data);
    };
    return (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-base">
            {" "}
            <FileUpload
                name="attachments"
                files={attachments}
                onDrop={(added) => setAttachments((prev) => [...prev, ...added])}
                onDeleteFile={(f) => setAttachments((prev) => prev.filter((x) => x !== f))}
                accept="image/*.pdf"
                multiple
                maxSize={10 * 1024 * 1024}
            />{" "}
            <Button theme="primary" type="submit">
                {" "}
                Submit{" "}
            </Button>{" "}
        </Form>
    );
}
```

## Do

- Set `accept` to the file types your server expects.
- Set `maxSize`. Use `onDropRejected` to explain oversized or unsupported files. Rejection renders no error message.
- Use `multiple` for batch uploads.
- Use the `File` prop for progress bars, metadata, or custom actions below each file row.
- Use design-token classes on wrapper elements (`bg-card-background`, `text-foreground`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't rely only on client-side `maxSize` and `accept`. Validate files on the server too.
- Don't omit `onDeleteFile` when `files` is controlled. Users cannot remove files without it.

## Accessibility

- The drop zone uses `getRootProps` and `getInputProps` of `react-dropzone` for keyboard support.
- The visible file-picker button uses native Enter and Space activation. Space opens the picker on release.
- The labels of the drop zone and hidden `<input type="file">` are singular by default and plural when `multiple={true}`.
- Assistive technologies can access the hidden `<input type="file">`.
- Delete buttons use `type="button"`, so they do not submit a form.
- The `Modal` component manages the preview viewer, including focus trapping and Escape to close.

## Interaction design and acceptance criteria

- Treat dropping files as a shortcut, not the only entry point.
- The default idle UI has a file-picker button. The dropzone delegates keyboard operation to `react-dropzone`.
- Avoid `noKeyboard` and `noClick` unless an equivalent reachable file-picker path remains.
- State accepted types, size and count limits, and whether multiple files are allowed before selection.
- Pass translated instructions through `translations`.
- A custom `idle` receives `onUpload` and `disabled`. It MUST keep a clearly named, operable picker control.
- Dropping files adds selections. It does not upload them to a server or reorder them.
- Controlled `files` require the application to update the array from `onDrop` and `onDeleteFile`.
- The application owns network progress and completion.
- `onDropRejected` is forwarded. The component renders no rejected-file messages and no live-region feedback.
- Explain the file-specific reason and a correction path. Do not delete previously accepted selections.
- Preview and removal buttons include the filename in their accessible names.
- The component does not move focus to a surviving item after removal. Verify focus after removing a file, canceling the picker, or closing the preview.
- Check visible focus and touch-target spacing on the dropzone and per-file controls in the actual app. Do not infer them from the drag-active visual.

## Data Attributes

- `data-active="true"`: on the drop zone wrapper when at least one file exists. It switches the border between dashed (empty) and solid (filled).

## Notes

- When `files` is not provided, the component keeps its own internal file state. Pass `files` for controlled behavior.
- `useEffect` cleanup revokes the object URLs created for previews, to prevent memory leaks.
- The `File` prop (custom renderer) renders inside the file list item, below the name and size row, next to the built-in delete button.
- `react-dropzone` and `pretty-bytes` are peer dependencies.

## Verification

Acceptance criteria for tests and reviews: [verify/FileUpload.md](verify/FileUpload.md).
