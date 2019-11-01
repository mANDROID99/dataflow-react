
export type TargetPort = {
    node: string;
    port: string;
}

export type GraphNodePorts = {
    in: {
        [name: string]: TargetPort | undefined;
    },
    out: {
        [name: string]: TargetPort[] | undefined;
    }
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
