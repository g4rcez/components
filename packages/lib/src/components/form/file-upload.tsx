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
import type React from "react";
import { cloneElement, createContext, Fragment, useContext, useEffect, useState } from "react";
import { type DropzoneOptions, type DropzoneProps, useDropzone } from "react-dropzone";
import type { Override } from "sidekicker";
import { useTranslations } from "../../hooks/use-translations";
import type { SetState } from "../../types";
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

    const Element =
        info.type === "img" ? (
            <img src={info.url} className="__file-upload__preview-image" alt={props.file.name} />
        ) : (
            <Icon className="__file-upload__file-icon" />
        );

    return (
        <li className="__file-upload__item __file-upload__row">
            <div className="__file-upload__stack __file-upload__column">
                <div className="__file-upload__file-row __file-upload__row">
                    <button
                        type="button"
                        onClick={onViewFile}
                        aria-label={translations.fileUploadViewFile(fileName)}
                        className="__file-upload__preview-button"
                    >
                        {Element}
                    </button>
                    <div className="__file-upload__file-details __file-upload__column">
                        <span>{props.file.name}</span>
                        <span className="__file-upload__size">{info.size}</span>
                    </div>
                </div>
                {props.File ? (
                    <div className="__file-upload__aside">
                        <props.File file={props.file} />
                    </div>
                ) : null}
            </div>
            <div className="__file-upload__actions">
                <button
                    onClick={onDeleteFile}
                    type="button"
                    aria-label={translations.fileUploadRemoveFile(fileName)}
                    className="__file-upload__remove-button"
                >
                    <XIcon aria-hidden="true" className="__file-upload__remove-icon" />
                </button>
            </div>
        </li>
    );
};

const FilesList = (props: { files: File[]; onDeleteFile?: (file: File) => void; File?: React.FC<{ file: File }> }) => (
    <ul className="__file-upload__list">
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
        <div className="__file-upload__idle __file-upload__column">
            <div className="__file-upload__idle-icon-wrap __file-upload__column">
                <span className="__file-upload__accent">
                    <Icon aria-hidden="true" className="__file-upload__idle-icon" />
                </span>
            </div>
            <div className="__file-upload__idle-copy __file-upload__column">
                <p>{t.uploadIdle}</p>
                <button
                    className="__file-upload__accent underline"
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
        <div className="__file-upload__stack __file-upload__column">
            <p className="__file-upload__viewer-name">{props.item.file.name}</p>
            <p className="__file-upload__viewer-size">{props.item.size}</p>
            {type === "img" ? (
                <img className="__file-upload__viewer-image container" src={props.item.url} alt={file.name} />
            ) : type === "video" ? (
                <video className="__file-upload__viewer-video container" src={props.item.url} controls muted />
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
                    className: "__file-upload __file-upload__dropzone",
                })}
            >
                <input {...getInputProps()} aria-label={t.fileUploadZoneLabel} name={props.name} id={props.name} />
                <InteractiveArea File={File} onDeleteFile={onDeleteFile} isDragActive={isDragActive} idle={idle} files={items} onUpload={open} />
            </div>
        </Context.Provider>
    );
};
