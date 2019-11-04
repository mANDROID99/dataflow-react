import * as SVG from 'svg.js';
import { Graph } from "../types/graphTypes";
import { GraphActions } from "../types/graphD3types";
import { GraphNodesManager } from "./GraphNodesManager";
import { GraphSpec } from "../types/graphSpecTypes";
import { GraphNodeComponent } from './GraphNode';
import { GraphConnectionsManager } from './GraphConnectionsManager';

export class GraphEditor {
    private readonly doc: SVG.Doc;
    private readonly actions: GraphActions;
    private readonly spec: GraphSpec;
    private readonly graphNodes: GraphNodesManager;
    private readonly graphConnections: GraphConnectionsManager;
    private graph: Graph;

    constructor(svg: SVGSVGElement, actions: GraphActions, spec: GraphSpec, graph: Graph) {
        this.doc = new SVG.Doc(svg as any as HTMLElement);
        this.actions = actions;
        this.spec = spec;
        this.graph = graph;

        const connectionsGroup = this.doc.group();
        const nodesGroup = this.doc.group();

        this.graphNodes = new GraphNodesManager(this, graph, nodesGroup);
        this.graphConnections = new GraphConnectionsManager(this, graph, connectionsGroup);
    }

    updateGraph(graph: Graph) {
        if (this.graph !== graph) {
            this.graph = graph;
            this.graphNodes.updateGraph(graph);
            this.graphConnections.updateGraph(graph);
        }
    }

    getGraph(): Graph {
        return this.graph;
    }

    getActions(): GraphActions {
        return this.actions;
    }
    
    getSpec(): GraphSpec {
        return this.spec;
    }

    getDoc(): SVG.Doc {
        return this.doc;
    }

    getNodeComponent(nodeId: string): GraphNodeComponent | undefined {
        return this.graphNodes.getNode(nodeId);
    }
}

