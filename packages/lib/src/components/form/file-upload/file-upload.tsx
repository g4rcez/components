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
import { defaultTranslations } from "../../../config/default-translations";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { SetState } from "../../../types";
import { Modal } from "../../floating/modal/modal";
import { fileUploadStyles } from "./file-upload.styles";

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
    xlsx: TableIcon,
    mp3: WaveformIcon,
    pdf: FileTextIcon,
    txt: FileTextIcon,
    json: FileCodeIcon,
    mov: FileVideoIcon,
    mp4: FileVideoIcon,
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
            <img src={info.url} className={fileUploadStyles.slots["preview-image"]} alt={props.file.name} />
        ) : (
            <Icon className={fileUploadStyles.slots["file-icon"]} />
        );

    return (
        <li className={css(fileUploadStyles.slots.item, fileUploadStyles.slots.row)}>
            <div className={css(fileUploadStyles.slots.stack, fileUploadStyles.slots.column)}>
                <div className={css(fileUploadStyles.slots["file-row"], fileUploadStyles.slots.row)}>
                    <button
                        type="button"
                        onClick={onViewFile}
                        aria-label={translations.fileUploadViewFile(fileName)}
                        className={fileUploadStyles.slots["preview-button"]}
                    >
                        {Element}
                    </button>
                    <div className={css(fileUploadStyles.slots["file-details"], fileUploadStyles.slots.column)}>
                        <span>{props.file.name}</span>
                        <span className={fileUploadStyles.slots.size}>{info.size}</span>
                    </div>
                </div>
                {props.File ? (
                    <div className={fileUploadStyles.slots.aside}>
                        <props.File file={props.file} />
                    </div>
                ) : null}
            </div>
            <div className={fileUploadStyles.slots.actions}>
                <button
                    onClick={onDeleteFile}
                    type="button"
                    aria-label={translations.fileUploadRemoveFile(fileName)}
                    className={fileUploadStyles.slots["remove-button"]}
                >
                    <XIcon aria-hidden="true" className={fileUploadStyles.slots["remove-icon"]} />
                </button>
            </div>
        </li>
    );
};

const FilesList = (props: { files: File[]; onDeleteFile?: (file: File) => void; File?: React.FC<{ file: File }> }) => (
    <ul className={fileUploadStyles.slots.list}>
        {props.files.map((file) => {
            return <ItemViewer File={props.File} onDeleteFile={props.onDeleteFile} key={file.name} file={file} />;
        })}
    </ul>
);

type IdleProps = {
    dragging: boolean;
    files?: File[];
    multiple?: boolean;
    onUpload?: () => void;
};

const singleFileUploadCopy = {
    idle: "Arraste seu arquivo para cá ou",
    idleButton: "clique para escolher um arquivo",
    zoneLabel: "Área de upload de arquivo. Arraste seu arquivo para cá ou pressione Enter para escolher um arquivo.",
};

// Keep existing translation-map overrides working while defaulting new single-file consumers to singular copy.
const getSingleFileCopy = (single: string, plural: string, defaultPlural: string) => (plural === defaultPlural ? single : plural);

const Idle = (props: IdleProps) => {
    const t = useTranslations();
    const Icon = props.dragging ? FolderOpenIcon : FolderIcon;
    const multiple = props.multiple === true;
    const idleCopy = multiple ? t.uploadIdle : getSingleFileCopy(singleFileUploadCopy.idle, t.uploadIdle, defaultTranslations.uploadIdle);
    const idleButtonCopy = multiple
        ? t.uploadIdleButton
        : getSingleFileCopy(singleFileUploadCopy.idleButton, t.uploadIdleButton, defaultTranslations.uploadIdleButton);

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
        <div className={css(fileUploadStyles.slots.idle, fileUploadStyles.slots.column)}>
            <div className={css(fileUploadStyles.slots["idle-icon-wrap"], fileUploadStyles.slots.column)}>
                <span className={fileUploadStyles.slots.accent}>
                    <Icon aria-hidden="true" className={fileUploadStyles.slots["idle-icon"]} />
                </span>
            </div>
            <div className={css(fileUploadStyles.slots["idle-copy"], fileUploadStyles.slots.column)}>
                <p>{idleCopy}</p>
                <button
                    className={css(fileUploadStyles.slots.accent, "underline")}
                    type="button"
                    aria-label={t.fileUploadUploadButtonLabel(idleButtonCopy)}
                    onClick={onUpload}
                    onKeyDown={onUploadKeyDown}
                >
                    {idleButtonCopy}
                </button>
            </div>
        </div>
    );
};

type InteractiveAreaProps = {
    files: File[];
    isDragActive: boolean;
    idle: React.ReactElement<IdleProps>;
    multiple: boolean;
    onUpload: () => void;
    File?: React.FC<{ file: File }>;
    onDeleteFile?: (file: File) => void;
};

const InteractiveArea = (props: InteractiveAreaProps) => {
    if (props.isDragActive) return <Idle files={props.files} dragging multiple={props.multiple} onUpload={props.onUpload} />;
    if (props.files.length > 0) {
        return <FilesList File={props.File} onDeleteFile={props.onDeleteFile} files={props.files} />;
    }
    return <Fragment>{cloneElement(props.idle, { onUpload: props.onUpload })}</Fragment>;
};

const FileViewer = (props: { item: ContextItem }) => {
    const file = props.item.file;
    const type = props.item.type;
    return (
        <div className={css(fileUploadStyles.slots.stack, fileUploadStyles.slots.column)}>
            <p className={fileUploadStyles.slots["viewer-name"]}>{props.item.file.name}</p>
            <p className={fileUploadStyles.slots["viewer-size"]}>{props.item.size}</p>
            {type === "img" ? (
                <img className={css(fileUploadStyles.slots["viewer-image"], "container")} src={props.item.url} alt={file.name} />
            ) : type === "video" ? (
                <video className={css(fileUploadStyles.slots["viewer-video"], "container")} src={props.item.url} controls muted />
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

export const FileUpload = ({ idle, onDeleteFile, File, onDrop, ...props }: Props) => {
    const t = useTranslations();
    const state = useState<ContextProps>(null);
    const [files, setFiles] = useState<File[]>([]);
    const items = props.files ?? files;
    const multiple = props.multiple === true;
    const zoneLabel = multiple
        ? t.fileUploadZoneLabel
        : getSingleFileCopy(singleFileUploadCopy.zoneLabel, t.fileUploadZoneLabel, defaultTranslations.fileUploadZoneLabel);

    const close = () => state[1](null);

    const onRemoveFile = (file: File) => {
        onDeleteFile?.(file);
        setFiles((prev) => prev.filter((x) => x !== file));
    };

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
                    "aria-label": zoneLabel,
                    "data-active": items ? items.length > 0 : false,
                    className: css(fileUploadStyles.className({}), fileUploadStyles.slots.dropzone),
                })}
            >
                <input {...getInputProps()} aria-label={zoneLabel} name={props.name} id={props.name} />
                <InteractiveArea
                    File={File}
                    onDeleteFile={onRemoveFile}
                    isDragActive={isDragActive}
                    idle={idle ?? <Idle dragging={false} multiple={multiple} />}
                    files={items}
                    multiple={multiple}
                    onUpload={open}
                />
            </div>
        </Context.Provider>
    );
};
