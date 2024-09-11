"use client";
import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileIcon, Trash2Icon, UploadIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../core/button";
const mime = {
    isImage: (file) => file.type.includes("image"),
};
const FileViewer = (props) => {
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
        return (_jsxs("div", { className: "flex flex-row gap-jade-200 items-center justify-between w-full", children: [_jsxs("header", { className: "flex flex-row gap-jade-200 items-center", children: [_jsx("img", { src: info.url, className: "size-jade-500 rounded-jade-xsmall", alt: `Miniatura do arquivo ${props.file.name}` }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { children: props.file.name }), _jsx("span", { children: info.size })] })] }), _jsx(Button, { className: "isolate", type: "button", theme: "raw", onClick: (e) => {
                        var _a;
                        e.stopPropagation();
                        (_a = props.onDeleteFile) === null || _a === void 0 ? void 0 : _a.call(props, props.file);
                    }, children: _jsx(Trash2Icon, {}) })] }));
    }
    return (_jsxs("div", { className: "flex flex-row gap-jade-200 items-center justify-between w-full", children: [_jsxs("header", { className: "flex flex-row gap-4 items-center", children: [_jsx(FileIcon, { size: 48 }), _jsxs("div", { className: "flex flex-col text-left justify-start items-start", children: [_jsx("span", { children: props.file.name }), _jsx("span", { children: info.size })] })] }), _jsx(Button, { className: "isolate", type: "button", theme: "raw", onClick: (e) => {
                    var _a;
                    e.stopPropagation();
                    (_a = props.onDeleteFile) === null || _a === void 0 ? void 0 : _a.call(props, props.file);
                }, children: _jsx(Trash2Icon, { className: "text-danger" }) })] }));
};
const DefaultViewer = (props) => {
    return (_jsx("ul", { className: "w-full space-y-jade-200", children: props.files.map((file) => {
            return _jsx(FileViewer, { onDeleteFile: props.onDeleteFile, file: file }, file.name);
        }) }));
};
const InteractiveArea = (props) => {
    if (props.isDragActive) {
        return _jsx("p", { children: "Solte os arquivos selecionados" });
    }
    if (props.files.length > 0) {
        return _jsx(DefaultViewer, { onDeleteFile: props.onDeleteFile, files: props.files });
    }
    return _jsx(Fragment, { children: props.idle });
};
const DefaultIdle = (_jsxs("div", { className: "flex flex-col gap-4 justify-center items-center", children: [_jsx(UploadIcon, { size: 64 }), _jsxs("p", { children: ["You can drag your files or", " ", _jsx("button", { className: "text-primary underline", type: "button", children: "drag to here" })] })] }));
export const FileUpload = (_a) => {
    var _b, _c;
    var { idle = DefaultIdle, onDeleteFile, onDrop } = _a, props = __rest(_a, ["idle", "onDeleteFile", "onDrop"]);
    const [files, setFiles] = useState([]);
    const drop = (x) => {
        onDrop === null || onDrop === void 0 ? void 0 : onDrop(x);
        setFiles(x);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: drop });
    return (_jsxs("div", Object.assign({}, getRootProps(), { "data-active": ((_b = props.files) === null || _b === void 0 ? void 0 : _b.length) ? props.files.length > 0 : false, className: "flex text-foreground flex-col items-center justify-center border-2 rounded-lg p-6 border-card-border data-[active=true]:bg-card-background data-[active=true]:border-solid data-[active=false]:border-dashed", children: [_jsx("input", Object.assign({}, getInputProps(props), { name: props.name, id: props.name })), _jsx(InteractiveArea, { onDeleteFile: onDeleteFile, isDragActive: isDragActive, idle: idle, files: (_c = props.files) !== null && _c !== void 0 ? _c : files })] })));
};
