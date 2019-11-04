
export type TargetPort = {
    node: string;
    port: string;
}

export type Ports = {
    [name: string]: TargetPort[] | undefined;
}

export type GraphNodePorts = {
    in: Ports,
    out: Ports
}

export type GraphNode = {
    id: string;
    title: string;
    type: string;
    x: number;
    y: number;
    ports: GraphNodePorts;
    fields: {
        [name: string]: unknown;
    };
}

export type Graph = {
    nodes: {
        [id: string]: GraphNode
    };
}
