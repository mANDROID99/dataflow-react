
export type GraphNode = {
    title?: string;
    type: string;
    x: number;
    y: number;
    config: unknown;
}

export type Connection = {
    outNode: string;
    outPort: string;
    inNode: string;
    inPort: string;
}

export type Graph = {
    nodes: {
        [nodeId: string]: GraphNode;
    };
    nodeIds: string[];
    connections: Connection[];
}
