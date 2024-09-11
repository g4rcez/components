import React from "react";
import { DropzoneProps } from "react-dropzone";
import { Override } from "sidekicker";
type Props = Override<React.ComponentProps<"input">, DropzoneProps> & {
    onDeleteFile?: (file: File) => void;
    files?: File[];
    idle?: React.ReactElement;
    onDrop?: (file: File[]) => void;
};
export declare const FileUpload: ({ idle, onDeleteFile, onDrop, ...props }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=file-upload.d.ts.map