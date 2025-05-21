"use client";
import {
    addEdge,
    Background,
    Controls,
    type Edge,
    Handle,
    MarkerType,
    MiniMap,
    type Node,
    OnConnect,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import { LucideProps, XIcon } from "lucide-react";
import React, { createContext, Fragment, memo, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { css } from "../lib/dom";
import { noop, uuid } from "../lib/fns";
import { Override } from "../types";

export type CreatableOpts = {
    id: string;
    type: string;
    title: string;
    value?: string;
    description?: string;
    Icon?: React.FC<LucideProps>;
    Item?: React.FC<FlowItem<any>>;
};

export type FlowItem<T extends CreatableOpts = CreatableOpts> = Override<Node, { data: T }>;


type ContextType = [CreatableOpts | null, (type: CreatableOpts | null) => void];

const DnDContext = createContext<ContextType>([null, () => { }]);

const DnDProvider = ({ children }: PropsWithChildren) => {
    const [type, setType] = useState<CreatableOpts | null>(null);
    return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};

const useDnD = () => {
    const [a, b] = useContext(DnDContext);
    return [a, b] as const;
};

const Sidebar = (props: { items: CreatableOpts[] }) => {
    const [, setType] = useDnD();

    const onDragStart = (event: React.DragEvent<HTMLLIElement>, nodeType: CreatableOpts) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="absolute top-0 right-0 p-2 rounded-lg border shadow min-w-24 border-floating-border bg-background">
            <ul className="space-y-2">
                {props.items.map((item) => (
                    <li
                        draggable
                        className="flex gap-1.5 items-center text-lg hover:cursor-grab hover:text-primary"
                        key={`${item.id}-flow-side-item`}
                        onDragStart={(event) => onDragStart(event, item)}
                    >
                        {item.Icon ? <item.Icon size={16} /> : null}
                        {item.title}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

type Props<T extends Node> = {
    items: T[];
    parents: CreatableOpts[];
    onChange: (a: any) => void;
    theme: "light" | "dark" | "system";
};

type CustomNodeProps = FlowItem<any> & {
    id: string;
    width: number;
    height: number;
    zIndex: number;
    dragging: boolean;
    selected: boolean;
    deletable: boolean;
    draggable: boolean;
    data: CreatableOpts;
    selectable: boolean;
    isConnectable: boolean;
    positionAbsoluteX: number;
    positionAbsoluteY: number;
    parentId: undefined | string;
    type: "input" | "custom" | "output";
};

const Handlers = (props: { id: string; type: "source" | "target" }) => {
    return (
        <Fragment>
            <Handle id={`${props.id}-handle-top`} type={props.type} position={Position.Top} className="h-1 w-10 !bg-primary" />
            <Handle id={`${props.id}-handle-left`} type={props.type} position={Position.Left} className="h-4 w-1 !bg-primary" />
            <Handle id={`${props.id}-handle-right`} type={props.type} position={Position.Right} className="h-4 w-1 !bg-primary" />
            <Handle id={`${props.id}-handle-bottom`} type={props.type} position={Position.Bottom} className="h-1 w-10 !bg-primary" />
        </Fragment>
    );
};

const Input = memo((node: CustomNodeProps) => {
    return (
        <div
            className={css(
                "relative flex border-2 min-h-10 min-w-24 items-center justify-center rounded-lg bg-floating-background px-4 py-2 shadow-md",
                node.selected ? "border-primary" : "",
                "border-floating-border"
            )}
        >
            <Handlers id={node.data.id} type="source" />
            {node.data.Item ? <node.data.Item {...node} /> : <h3 className="text-center">{node.data.title}</h3>}
        </div>
    );
});

const Connection = memo((node: CustomNodeProps) => {
    const { deleteElements } = useReactFlow();
    const onClick = () => deleteElements({ nodes: [node] }).then(noop);

    return (
        <div
            className={css(
                "relative flex min-h-10 min-w-24 items-center justify-center rounded-lg bg-floating-background px-4 py-2 shadow-md",
                node.selected ? "border-4" : "border",
                "border-floating-border"
            )}
        >
            <button
                className="flex absolute top-2 right-2 justify-center items-center text-foreground hover:text-danger active:text-danger"
                onClick={onClick}
            >
                <XIcon size={18} />
            </button>
            <Handlers id={node.data.id} type="target" />
            {node.data.Item ? <node.data.Item {...node} /> : <h3 className="text-center">{node.data.title}</h3>}
        </div>
    );
});

const nodeTypes = { input: Input, output: Connection };

const AddNodeOnEdgeDrop = <T extends Node = Node>(props: Props<T>) => {
    const [type, setType] = useDnD();
    const ref = useRef<HTMLDivElement>(null);
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(props.items);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { screenToFlowPosition } = useReactFlow();

    useEffect(() => {
        props.onChange(nodes);
    }, [nodes.length]);

    const onConnect = useCallback<OnConnect>(
        (params) => {
            setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.Arrow } }, eds));
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (!type) return;
            const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
            const id = uuid();
            const newNode = {
                id,
                position,
                type: "output",
                data: { ...type, id, label: type.title },
            } as never as T;
            setNodes((prev) => [...prev, newNode]);
        },
        [screenToFlowPosition, setNodes, type]
    );

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: CreatableOpts) => {
        setType(nodeType);
        event.dataTransfer.setData("text/plain", JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="relative w-full bg-card-background" style={{ height: 1000 }} ref={reactFlowWrapper}>
            <ReactFlow
                fitView
                ref={ref}
                edges={edges}
                nodes={nodes}
                onDrop={onDrop}
                nodeOrigin={[0, 0]}
                onConnect={onConnect}
                onDragOver={onDragOver}
                className="bg-background"
                nodeTypes={nodeTypes as any}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                attributionPosition="top-right"
                fitViewOptions={{ padding: 2 }}
                onDragStart={onDragStart as any}
                colorMode={props.theme ?? "dark"}
            >
                <MiniMap />
                <Background bgColor="hsla(var(--floating-background))" />
                <Controls />
            </ReactFlow>
            <Sidebar items={props.parents} />
        </div>
    );
};

export const Flow = <T extends Node = Node>(props: Props<T>) => (
    <ReactFlowProvider fitView initialMaxZoom={1}>
        <DnDProvider>
            <AddNodeOnEdgeDrop {...props} />
        </DnDProvider>
    </ReactFlowProvider>
);
