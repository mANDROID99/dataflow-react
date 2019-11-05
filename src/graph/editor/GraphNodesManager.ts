import * as SVG from 'svg.js';
import { Graph } from "../types/graphTypes";

import { GraphEditor } from "./GraphEditor";
import { GraphNodeComponent } from './GraphNode';

export class GraphNodesManager {
    private readonly editor: GraphEditor;
    private readonly group: SVG.G;
    private readonly components: Map<string, GraphNodeComponent>;

    constructor(editor: GraphEditor, graph: Graph, group: SVG.G) {
        this.editor = editor;
        this.group = group;
        this.components = new Map<string, GraphNodeComponent>();
        this.updateGraph(graph);
    }

    updateGraph(graph: Graph): void {
        const nodes = graph.nodes;
        for (const nodeId of Object.keys(nodes)) {
            const node = nodes[nodeId];
            let component = this.components.get(nodeId);
            
            if (component) {
                component.updateNode(node);

            } else {
                component = new GraphNodeComponent(this.editor, this.group, nodeId, node);
                this.components.set(nodeId, component);
            }
        }

        for (const entry of this.components) {
            const nodeId = entry[0];
            if (!(nodeId in nodes)) {
                entry[1].remove();
                this.components.delete(nodeId);
            }
        }
    }

    findNode(nodeId: string): GraphNodeComponent | undefined {
        return this.components.get(nodeId);
    }
}
