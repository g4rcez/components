"use client";
import {
    WaveformIcon,
    FileIcon,
    FileCodeIcon,
    FileTextIcon,
    FileVideoIcon,
    FolderIcon,
    FolderOpenIcon,
    type Icon,
    TableIcon,
    XIcon,
} from "@phosphor-icons/react";
import prettyBytes from "pretty-bytes";
import React, { cloneElement, createContext, Fragment, useContext, useEffect, useState } from "react";
import { DropzoneOptions, DropzoneProps, useDropzone } from "react-dropzone";
import { Override } from "sidekicker";
import { useTranslations } from "../../hooks/use-translations";
import { SetState } from "../../types";
import { Modal } from "../floating/modal";

type ContextItem = { file: File; url: string; type: string; size: string };

type ContextProps = null | ContextItem;

const Context = createContext<[state: ContextProps, setState: SetState<ContextProps>]>([null, () => {}]);

const useFileManager = () => useContext(Context);

type Props = Override<React.ComponentProps<"input">, DropzoneProps> & {
    files?: File[];
    idle?: React.ReactElement<IdleProps>;
    File?: React.FC<{ file: File }>;
    onDrop?: (file: File[]) => void;
    onDeleteFile?: (file: File) => void;
};

const getMimeType = (file: File) => {
    if (file.type.startsWith("image/")) return "img";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.startsWith("video/")) return "video";
    return file.type;
};

const extensionMap: Record<string, Icon> = {
    csv: TableIcon,
    xls: TableIcon,
    mov: FileVideoIcon,
    mp4: FileVideoIcon,
    xlsx: TableIcon,
    pdf: FileTextIcon,
    txt: FileTextIcon,
    json: FileCodeIcon,
    mp3: WaveformIcon,
};

const ItemViewer = (props: { file: File; onDeleteFile?: (file: File) => void; File?: React.FC<{ file: File }> }) => {
    const translations = useTranslations();
    const [, setManager] = useFileManager();
    const [info, setInfo] = useState({ url: "", type: "", size: "" });

    useEffect(() => {
        const file = props.file;
        const url = URL.createObjectURL(file);
        setInfo({ url, type: getMimeType(file), size: prettyBytes(file.size) });
        return () => URL.revokeObjectURL(url);
    }, [props.file]);

    const onViewFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setManager({ ...info, file: props.file });
    };

    const onDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        props.onDeleteFile?.(props.file);
    };

    const fileName = props.file.name;

    const Icon = extensionMap[props.file.name.split(".").at(-1)!] ?? FileIcon;

    const Element = info.type === "img" ? <img src={info.url} className="w-full object-contain" alt={props.file.name} /> : <Icon size={48} />;

    return (
        <li className="flex w-full flex-row justify-between gap-file-upload-gap border-b border-card-border last:border-b-transparent">
            <div className="flex flex-col gap-file-upload-gap">
                <div className="flex flex-row items-center gap-file-upload-gap">
                    <button
                        type="button"
                        onClick={onViewFile}
                        aria-label={translations.fileUploadViewFile(fileName)}
                        className="m-2 flex size-file-upload-thumb-size items-center justify-center overflow-hidden"
                    >
                        {Element}
                    </button>
                    <div className="flex flex-col items-start justify-start text-left">
                        <span>{props.file.name}</span>
                        <span className="text-file-upload-text-size italic">{info.size}</span>
                    </div>
                </div>
                {props.File ? (
                    <div className="min-w-full flex-1">
                        <props.File file={props.file} />
                    </div>
                ) : null}
            </div>
            <div className="align-start flex justify-start py-file-upload-delete-py transition-colors duration-300 ease-linear hover:text-danger-hover">
                <button
                    onClick={onDeleteFile}
                    type="button"
                    aria-label={translations.fileUploadRemoveFile(fileName)}
                    className="flex size-6 items-center justify-center"
                >
                    <XIcon size={16} aria-hidden="true" />
                </button>
            </div>
        </li>
    );
};

const FilesList = (props: { files: File[]; onDeleteFile?: (file: File) => void; File?: React.FC<{ file: File }> }) => (
    <ul className="w-full space-y-8">
        {props.files.map((file) => {
            return <ItemViewer File={props.File} onDeleteFile={props.onDeleteFile} key={file.name} file={file} />;
        })}
    </ul>
);

type IdleProps = {
    dragging: boolean;
    files?: File[];
    onUpload?: () => void;
};

const Idle = (props: IdleProps) => {
    const t = useTranslations();
    const Icon = props.dragging ? FolderOpenIcon : FolderIcon;

    const onUpload = (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        props.onUpload?.();
    };

    const onUploadKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        onUpload(event);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-file-upload-inner-gap">
                <span className="text-primary">
                    <Icon size={80} aria-hidden="true" />
                </span>
            </div>
            <div className="my-file-upload-thumb-my flex flex-col items-center gap-file-upload-thumb-gap">
                <p>{t.uploadIdle}</p>
                <button
                    className="text-primary underline"
                    type="button"
                    aria-label={t.fileUploadUploadButtonLabel(t.uploadIdleButton)}
                    onClick={onUpload}
                    onKeyDown={onUploadKeyDown}
                >
                    {t.uploadIdleButton}
                </button>
            </div>
        </div>
    );
};

type InteractiveAreaProps = {
    files: File[];
    isDragActive: boolean;
    idle: React.ReactElement<IdleProps>;
    onUpload: () => void;
    File?: React.FC<{ file: File }>;
    onDeleteFile?: (file: File) => void;
};

const InteractiveArea = (props: InteractiveAreaProps) => {
    if (props.isDragActive) return <Idle files={props.files} dragging onUpload={props.onUpload} />;
    if (props.files.length > 0) {
        return <FilesList File={props.File} onDeleteFile={props.onDeleteFile} files={props.files} />;
    }
    return <Fragment>{cloneElement(props.idle, { onUpload: props.onUpload })}</Fragment>;
};

const DefaultIdle = <Idle dragging={false} />;

const FileViewer = (props: { item: ContextItem }) => {
    const file = props.item.file;
    const type = props.item.type;
    return (
        <div className="flex flex-col gap-file-upload-gap">
            <p className="text-file-upload-text-name font-medium">{props.item.file.name}</p>
            <p className="text-file-upload-text-size">{props.item.size}</p>
            {type === "img" ? (
                <img className="container inline-block w-full max-w-96" src={props.item.url} alt={file.name} />
            ) : type === "video" ? (
                <video className="container block w-full max-w-96" src={props.item.url} controls muted />
            ) : type === "audio" ? (
                <figure>
                    <audio controls src={props.item.url}>
                        <track kind="captions" />
                    </audio>
                </figure>
            ) : null}
        </div>
    );
};

export const FileUpload = ({ idle = DefaultIdle, onDeleteFile, File, onDrop, ...props }: Props) => {
    const t = useTranslations();
    const state = useState<ContextProps>(null);
    const [files, setFiles] = useState<File[]>([]);
    const items = props.files ?? files;

    const close = () => state[1](null);

    const drop = (x: File[]) => {
        onDrop?.(x);
        setFiles((prev) => prev.concat(x));
    };

    const dropzoneOptions: DropzoneOptions = {
        multiple: props.multiple,
        onDragEnter: props.onDragEnter,
        onDragOver: props.onDragOver,
        onDragLeave: props.onDragLeave,
        onDrop: drop,
    };
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone(dropzoneOptions);

    return (
        <Context.Provider value={state}>
            <Modal overlayClickClose title={t.uploadDialogTitle} ariaTitle={t.uploadDialogTitle} open={state[0] !== null} onChange={close}>
                {state[0] ? <FileViewer item={state[0]!} /> : null}
            </Modal>
            <div
                {...getRootProps({
                    "aria-label": t.fileUploadZoneLabel,
                    "data-active": items ? items.length > 0 : false,
                    className:
                        "flex flex-col items-center justify-center rounded-file-upload-radius border border-card-border p-file-upload-p text-foreground data-[active=true]:border-solid data-[active=false]:border-dashed data-[active=true]:border-transparent data-[active=true]:bg-card-background",
                })}
            >
                <input {...getInputProps()} aria-label={t.fileUploadZoneLabel} name={props.name} id={props.name} />
                <InteractiveArea File={File} onDeleteFile={onDeleteFile} isDragActive={isDragActive} idle={idle} files={items} onUpload={open} />
            </div>
        </Context.Provider>
    );
};
