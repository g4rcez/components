"use client";
import {
    AudioLinesIcon,
    FileIcon,
    FileJsonIcon,
    FileTextIcon,
    FileVideo2,
    FolderIcon,
    FolderOpenIcon,
    LucideProps,
    SheetIcon,
    XIcon,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import React, { createContext, Fragment, useContext, useEffect, useState } from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";
import { Override } from "sidekicker";
import { useTranslations } from "../../hooks/use-translations";
import { SetState } from "../../types";
import { Modal } from "../floating/modal";

type ContextItem = { file: File; url: string; type: string; size: string };

type ContextProps = null | ContextItem;

const Context = createContext<[state: ContextProps, setState: SetState<ContextProps>]>([null, () => { }]);

const useFileManager = () => useContext(Context);

type Props = Override<React.ComponentProps<"input">, DropzoneProps> & {
    files?: File[];
    idle?: React.ReactElement;
    onDrop?: (file: File[]) => void;
    onDeleteFile?: (file: File) => void;
};

const getMimeType = (file: File) => {
    if (file.type.startsWith("image/")) return "img"
    if (file.type.startsWith("audio/")) return "audio"
    if (file.type.startsWith("video/")) return "video"
    return file.type
}

const extensionMap: Record<string, React.FC<LucideProps>> = {
    csv: SheetIcon,
    xls: SheetIcon,
    mov: FileVideo2,
    mp4: FileVideo2,
    xlsx: SheetIcon,
    pdf: FileTextIcon,
    txt: FileTextIcon,
    json: FileJsonIcon,
    mp3: AudioLinesIcon,
};

const ItemViewer = (props: { file: File; onDeleteFile?: (file: File) => void }) => {
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
    }

    const onDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        props.onDeleteFile?.(props.file);
    }

    const Icon = extensionMap[props.file.name.split(".").at(-1)!] ?? FileIcon;

    const Element =
        info.type === "img" ? (
            <img src={info.url} className="block w-full" alt={props.file.name} />
        ) : (
            <Icon strokeWidth={2} absoluteStrokeWidth size={48} />
        );

    return (
        <li className="flex flex-row gap-4 justify-between items-center pb-6 w-full border-b border-card-border last:border-b-transparent">
            <header className="flex flex-row gap-4 items-center">
                <button type="button" onClick={onViewFile} className="flex justify-center items-center size-20">
                    {Element}
                </button>
                <div className="flex flex-col justify-start items-start text-left">
                    <span>{props.file.name}</span>
                    <span className="text-sm italic">{info.size}</span>
                </div>
            </header>
            <button onClick={onDeleteFile} type="button" className="p-2 transition-colors duration-300 ease-linear hover:text-danger-hover">
                <XIcon size={16} />
            </button>
        </li>
    );
};

const DefaultViewer = (props: { files: File[]; onDeleteFile?: (file: File) => void }) => {
    return (
        <ul className="space-y-8 w-full">
            {props.files.map((file) => {
                return <ItemViewer onDeleteFile={props.onDeleteFile} key={file.name} file={file} />;
            })}
        </ul>
    );
};

const Idle = (props: { dragging: boolean; files?: File[] }) => {
    const t = useTranslations();
    const Icon = props.dragging ? FolderOpenIcon : FolderIcon;
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col gap-2 justify-center items-center">
                <Icon className="text-primary" size={80} />
            </div>
            <div className="flex flex-col gap-1 items-center my-4">
                <p>{t.uploadIdle}</p>
                <button className="underline text-primary" type="button">
                    {t.uploadIdleButton}
                </button>
            </div>
        </div>
    );
};

const InteractiveArea = (props: { isDragActive: boolean; idle: React.ReactElement; files: File[]; onDeleteFile?: (file: File) => void }) => {
    if (props.isDragActive) return <Idle files={props.files} dragging />;
    if (props.files.length > 0) {
        return <DefaultViewer onDeleteFile={props.onDeleteFile} files={props.files} />;
    }
    return <Fragment>{props.idle}</Fragment>;
};

const DefaultIdle = <Idle dragging={false} />;

const FileViewer = (props: { item: ContextItem }) => {
    const file = props.item.file;
    const type = props.item.type
    return (
        <div className="flex flex-col gap-4">
            <p className="text-lg font-medium">{props.item.file.name}</p>
            <p className="text-base">{props.item.size}</p>
            {type === "img" ? (
                <img className="container block w-80" src={props.item.url} alt={file.name} />
            ) : type === "video" ? (
                <video className="container block w-80" src={props.item.url} controls muted />
            ) : type === "audio" ? <figure><audio controls src={props.item.url}></audio></figure> : null}
        </div>
    );
};

export const FileUpload = ({ idle = DefaultIdle, onDeleteFile, onDrop, ...props }: Props) => {
    const t = useTranslations();
    const state = useState<ContextProps>(null);
    const [files, setFiles] = useState<File[]>([]);
    const items = props.files ?? files;

    const close = () => state[1](null);

    const drop = (x: File[]) => {
        onDrop?.(x);
        setFiles((prev) => prev.concat(x));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: drop });

    return (
        <Context.Provider value={state}>
            <Modal overlayClickClose title={t.uploadDialogTitle} ariaTitle={t.uploadDialogTitle} open={state[0] !== null} onChange={close}>
                {state[0] ? <FileViewer item={state[0]!} /> : null}
            </Modal>
            <div
                {...getRootProps()}
                data-active={items ? items.length > 0 : false}
                className="flex flex-col border items-center justify-center rounded-lg border-card-border p-6 text-foreground data-[active=true]:border-solid data-[active=false]:border-dashed data-[active=true]:bg-card-background data-[active=true]:border-transparent"
            >
                <input {...getInputProps(props as any)} name={props.name} id={props.name} />
                <InteractiveArea onDeleteFile={onDeleteFile} isDragActive={isDragActive} idle={idle} files={items} />
            </div>
        </Context.Provider>
    );
};

