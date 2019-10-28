export type GraphFieldInputProps<T> = {
    value: T | undefined;
    onChanged(value: T): void;
}

export type GraphFieldInputSpec<T> = {
    component: React.ComponentType<GraphFieldInputProps<T>>;
};

export type GraphNodeFieldSpec = {
    name: string;
    label: string;
    type: string;
}

export type GraphNodePortSpec = {
    name: string;
    label: string;
    type: string;
}

export type GraphNodeSpec = {
    fields: GraphNodeFieldSpec[];
    portsIn: GraphNodePortSpec[];
    portsOut: GraphNodePortSpec[];
}

export type GraphNodePort = {
    dragging: boolean;
}

export type GraphNode = {
    title: string;
    type: string;
    x: number;
    y: number;
    values: {
        [name: string]: unknown;
    };
    portsIn: {
        [name: string]: GraphNodePort | undefined;
    };
    portsOut: {
        [name: string]: GraphNodePort | undefined;
    };
}

export type Graph = {
    nodes: {
        [id: string]: GraphNode
    };
}

export type GraphSpec = {
    nodes: {
        [id: string]: GraphNodeSpec
    };
    inputs: {
        [id: string]: GraphFieldInputSpec<any>
    };
}

export type GraphActions = {
    onNodeRemoved(nodeId: string): void;
    onNodePosChanged(nodeId: string, x: number, y: number): void;
    onNodeFieldChanged(nodeId: string, fieldName: string, value: unknown): void;
    onNodePortStartDrag(nodeId: string, portOut: boolean, portName: string): void;
    onNodePortEndDrag(nodeId: string, portOut: boolean, portName: string): void;
}
