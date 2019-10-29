
export type GraphPort = {
    node: string;
    port: string;
}

export type GraphNodePorts = {
    in: {
        [name: string]: GraphPort | undefined;
    },
    out: {
        [name: string]: GraphPort | undefined;
    }
}

export type GraphNode = {
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
