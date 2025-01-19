"use client";
import { FileIcon, Trash2Icon, UploadIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import React, { Fragment, useEffect, useState } from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";
import { Override } from "sidekicker";
import { Button } from "../core/button";

type Props = Override<React.ComponentProps<"input">, DropzoneProps> & {
    onDeleteFile?: (file: File) => void;
    files?: File[];
    idle?: React.ReactElement;
    onDrop?: (file: File[]) => void;
};

const mime = {
    isImage: (file: File) => file.type.includes("image"),
};

const FileViewer = (props: { file: File; onDeleteFile?: (file: File) => void }) => {
    const [info, setInfo] = useState({ url: "", type: "", size: "" });
    useEffect(() => {
        if (mime.isImage(props.file)) {
            const url = URL.createObjectURL(props.file);
            setInfo({ url, type: "img", size: prettyBytes(props.file.size) });
            return () => {
                URL.revokeObjectURL(url);
            };
        }
        setInfo({ url: "", type: props.file.type, size: prettyBytes(props.file.size) });
    }, [props.file]);

    if (info.type === "img") {
        return (
            <div className="gap-jade-200 flex w-full flex-row items-center justify-between">
                <header className="gap-jade-200 flex flex-row items-center">
                    <img src={info.url} className="size-jade-500 rounded-jade-xsmall" alt={`Miniatura do arquivo ${props.file.name}`} />
                    <div className="flex flex-col">
                        <span>{props.file.name}</span>
                        <span>{info.size}</span>
                    </div>
                </header>
                <Button
                    className="isolate"
                    type="button"
                    theme="raw"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        props.onDeleteFile?.(props.file);
                    }}
                >
                    <Trash2Icon />
                </Button>
            </div>
        );
    }
    return (
        <div className="gap-jade-200 flex w-full flex-row items-center justify-between">
            <header className="flex flex-row items-center gap-4">
                <FileIcon size={48} />
                <div className="flex flex-col items-start justify-start text-left">
                    <span>{props.file.name}</span>
                    <span>{info.size}</span>
                </div>
            </header>
            <Button
                className="isolate"
                type="button"
                theme="raw"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    props.onDeleteFile?.(props.file);
                }}
            >
                <Trash2Icon className="text-danger" />
            </Button>
        </div>
    );
};

const DefaultViewer = (props: { files: File[]; onDeleteFile?: (file: File) => void }) => {
    return (
        <ul className="space-y-jade-200 w-full">
            {props.files.map((file) => {
                return <FileViewer onDeleteFile={props.onDeleteFile} key={file.name} file={file} />;
            })}
        </ul>
    );
};

const InteractiveArea = (props: { isDragActive: boolean; idle: React.ReactElement; files: File[]; onDeleteFile?: (file: File) => void }) => {
    if (props.isDragActive) {
        return <p>Solte os arquivos selecionados</p>;
    }
    if (props.files.length > 0) {
        return <DefaultViewer onDeleteFile={props.onDeleteFile} files={props.files} />;
    }
    return <Fragment>{props.idle}</Fragment>;
};

const DefaultIdle = (
    <div className="flex flex-col items-center justify-center gap-4">
        <UploadIcon size={64} />
        <p>
            You can drag your files or{" "}
            <button className="text-primary underline" type="button">
                drag to here
            </button>
        </p>
    </div>
);

export const FileUpload = ({ idle = DefaultIdle, onDeleteFile, onDrop, ...props }: Props) => {
    const [files, setFiles] = useState<File[]>([]);
    const drop = (x: File[]) => {
        onDrop?.(x);
        setFiles(x);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: drop });
    return (
        <div
            {...getRootProps()}
            data-active={props.files?.length ? props.files.length > 0 : false}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-card-border p-6 text-foreground data-[active=true]:border-solid data-[active=false]:border-dashed data-[active=true]:bg-card-background"
        >
            <input {...getInputProps(props as any)} name={props.name} id={props.name} />
            <InteractiveArea onDeleteFile={onDeleteFile} isDragActive={isDragActive} idle={idle} files={props.files ?? files} />
        </div>
    );
};
