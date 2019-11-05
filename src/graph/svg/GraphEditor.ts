import * as SVG from 'svg.js';
import { Graph } from "../types/graphTypes";
import { GraphActions } from "../types/graphEditorTypes";
import { GraphNodesManager } from "./GraphNodesManager";
import { GraphSpec } from "../types/graphSpecTypes";
import { GraphNodeComponent } from './GraphNode';
import { GraphConnectionsManager } from './GraphConnectionsManager';
import { PortDragTarget } from '../types/graphEditorTypes';

export class GraphEditor {
    private readonly doc: SVG.Doc;
    private readonly actions: GraphActions;
    private readonly spec: GraphSpec;

    private readonly connectionsGroup: SVG.G;
    private readonly nodesGroup: SVG.G;
    private readonly graphNodes: GraphNodesManager;
    private readonly graphConnections: GraphConnectionsManager;

    private graph: Graph;
    private portDrag?: PortDragTarget;
    private portDragTarget?: PortDragTarget;

    constructor(svg: SVGSVGElement, actions: GraphActions, spec: GraphSpec, graph: Graph) {
        this.doc = new SVG.Doc(svg as any as HTMLElement);
        this.actions = actions;
        this.spec = spec;
        this.graph = graph;

        this.connectionsGroup = this.doc.group();
        this.nodesGroup = this.doc.group();
        
        this.graphNodes = new GraphNodesManager(this, graph, this.nodesGroup);
        this.graphConnections = new GraphConnectionsManager(this, graph, this.connectionsGroup);
    }

    updateGraph(graph: Graph): void {
        if (this.graph !== graph) {
            this.graph = graph;
            this.graphNodes.updateGraph(graph);
            this.graphConnections.updateGraph(graph);
        }
    }

    onPortDragChanged(portDrag?: PortDragTarget): void {
        this.portDrag = portDrag;
        this.portDragTarget = undefined;
        this.graphNodes.onPortDragChanged(portDrag);
    }

    onPortDragTargetChanged(portDragTarget?: PortDragTarget): void {
        this.portDragTarget = portDragTarget;
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

    getConnectionsGroup(): SVG.G {
        return this.connectionsGroup;
    }

    getPortDrag(): PortDragTarget | undefined {
        return this.portDrag;
    }
}

