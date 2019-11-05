import * as SVG from 'svg.js';
import { Graph } from "../types/graphTypes";
import { GraphConnection } from "./GraphConnection";
import { GraphEditor } from "./GraphEditor";

// type NodeConnections = {
//     in: Map<string, GraphConnection[]>;
//     out: Map<string, GraphConnection[]>;
// }

export class GraphConnectionsManager {
    private readonly editor: GraphEditor;
    private readonly group: SVG.G;
    private readonly connections: Map<string, GraphConnection>;

    constructor(editor: GraphEditor, graph: Graph, group: SVG.G) {
        this.editor = editor;
        this.group = group;
        this.connections = new Map<string, GraphConnection>();
        this.updateGraph(graph);
    }

    updateGraph(graph: Graph): void {
        const updatedKeys = new Set<string>();
        const nodes = graph.nodes;

        for (const nodeId of Object.keys(nodes)) {
            const node = nodes[nodeId];

            const nodeComponent = this.editor.getNodeComponent(nodeId);
            if (!nodeComponent) continue;

            const portsOut = node.ports.out;
            for (const portId of Object.keys(portsOut)) {
                const port = portsOut[portId];
                if (!port) continue;

                const portComponent = nodeComponent.getPortComponent(portId, true);
                if (!portComponent) continue;

                for (const target of port) {
                    const targetNodeComponent = this.editor.getNodeComponent(target.node);
                    if (!targetNodeComponent) continue;

                    const targetPortComponent = targetNodeComponent.getPortComponent(target.port, false);
                    if (!targetPortComponent) continue;

                    const key = this.getConnectionKey(nodeId, portId, target.node, target.port);
                    updatedKeys.add(key);

                    let connection = this.connections.get(key);
                    if (!connection) {
                        connection = new GraphConnection(this.group, portComponent, targetPortComponent);
                        this.connections.set(key, connection);
                    }
                }
            }
        }

        const it = this.connections.keys();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const e = it.next();
            if (e.done) break;
            const key = e.value;

            if (!updatedKeys.has(key)) {
                const connection = this.connections.get(key);

                if (connection) {
                    this.connections.delete(key);
                    connection.remove();
                }
            }
        }
    }

    private getConnectionKey(startNode: string, startPort: string, endNode: string, endPort: string): string {
        return [startNode, startPort, endNode, endPort].join('__');
    }
}
