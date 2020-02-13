
export type TargetPort = {
    node: string;
    port: string;
}

export type TargetPorts = {
    [name: string]: TargetPort[] | undefined;
}

export type GraphNodePorts = {
    in: TargetPorts;
    out: TargetPorts;
}

export type GraphNode = {
    id: string;
    type: string;
    name: string;
    x: number;
    y: number;
    width: number;
    ports: GraphNodePorts;
    collapsed?: boolean;
    fields: {
        [name: string]: unknown;
    };
}

export type Graph = {
    nodes: {
        [id: string]: GraphNode;
    };
}
