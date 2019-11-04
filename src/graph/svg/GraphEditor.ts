import * as SVG from 'svg.js';
import { Graph } from "../types/graphTypes";
import { GraphActions } from "../types/graphD3types";
import { GraphNodesManager } from "./GraphNodesManager";
import { GraphSpec } from "../types/graphSpecTypes";

export class GraphEditor {
    private readonly doc: SVG.Doc;
    private readonly actions: GraphActions;
    private readonly spec: GraphSpec;
    private readonly graphNodes: GraphNodesManager;
    private graph: Graph;

    constructor(svg: SVGSVGElement, actions: GraphActions, spec: GraphSpec, graph: Graph) {
        this.doc = new SVG.Doc(svg as any as HTMLElement);
        this.actions = actions;
        this.spec = spec;
        this.graph = graph;

        const nodesGroup = this.doc.group();
        this.graphNodes = new GraphNodesManager(this, graph, nodesGroup);
    }

    updateGraph(graph: Graph) {
        if (this.graph !== graph) {
            this.graph = graph;
            this.graphNodes.updateGraph(graph);
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
}

