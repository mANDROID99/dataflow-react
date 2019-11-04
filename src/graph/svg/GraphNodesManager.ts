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

    updateGraph(graph: Graph) {
        const nodes = graph.nodes;
        for (let nodeId of Object.keys(nodes)) {
            const node = nodes[nodeId];
            let component = this.components.get(nodeId);
            
            if (component) {
                component.setNode(node);

            } else {
                component = new GraphNodeComponent(this.editor, this.group, nodeId, node);
                this.components.set(nodeId, component);
            }
        }

        const keysIt = this.components.keys();
        while (true) {
            const k = keysIt.next();
            if (k.done) break;

            const nodeId = k.value;
            if (!(nodeId in nodes)) {
                this.components.get(nodeId)!.remove();
                this.components.delete(nodeId);
            }
        }
    }

    getNode(nodeId: string): GraphNodeComponent | undefined {
        return this.components.get(nodeId);
    }
}
