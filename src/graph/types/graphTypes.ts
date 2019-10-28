
export type GraphNode = {
    title: string;
    type: string;
    x: number;
    y: number;
    values: {
        [name: string]: unknown;
    };
    portsIn: {
        [name: string]: string | undefined;
    };
    portsOut: {
        [name: string]: string | undefined;
    }
}

export type Graph = {
    nodes: {
        [id: string]: GraphNode
    };
}
