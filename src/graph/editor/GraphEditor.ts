import * as SVG from 'svg.js';
import { Graph } from "../types/graphTypes";
import { GraphActions } from "../types/graphEditorTypes";
import { GraphNodesManager } from "./GraphNodesManager";
import { GraphSpec } from "../types/graphSpecTypes";
import { GraphNodeComponent } from './GraphNode';
import { GraphConnectionsManager } from './GraphConnectionsManager';
import { PortDragTarget } from '../types/graphEditorTypes';
import { GraphEditorEvents, EventType, GraphEditorListener, GraphEditorEvent } from './GraphEditorEvents';
import { GraphNodePortComponent } from './ports/GraphNodePort';

export class GraphEditor {
    public readonly doc: SVG.Doc;
    public readonly actions: GraphActions;
    public readonly spec: GraphSpec;

    public readonly connectionsGroup: SVG.G;
    public readonly nodesGroup: SVG.G;
    public readonly graphNodes: GraphNodesManager;
    public readonly graphConnections: GraphConnectionsManager;
    public readonly events: GraphEditorEvents;

    private _graph: Graph;
    private _activePort?: PortDragTarget;
    private _targetPort?: PortDragTarget;

    constructor(svg: SVGSVGElement, actions: GraphActions, spec: GraphSpec, graph: Graph) {
        this.doc = new SVG.Doc(svg as any as HTMLElement);
        this.actions = actions;
        this.spec = spec;
        this._graph = graph;

        this.connectionsGroup = this.doc.group();
        this.nodesGroup = this.doc.group();
        
        this.events = new GraphEditorEvents();
        this.graphNodes = new GraphNodesManager(this, graph, this.nodesGroup);
        this.graphConnections = new GraphConnectionsManager(this, graph, this.connectionsGroup);
    }

    updateGraph(graph: Graph): void {
        if (this._graph !== graph) {
            this._graph = graph;
            this.graphNodes.updateGraph(graph);
            this.graphConnections.updateGraph(graph);
        }
    }

    onActivePortChanged(activePort?: PortDragTarget): void {
        this._activePort = activePort;
        this._targetPort = undefined;

        this.trigger({
            type: EventType.ACTIVE_PORT_CHANGED,
            port: activePort
        });
    }

    onTargetPortChanged(targetPort?: PortDragTarget): void {
        this._targetPort = targetPort;

        this.trigger({
            type: EventType.TARGET_PORT_CHANGED,
            port: targetPort
        });
    }

    findNode(nodeId: string): GraphNodeComponent | undefined {
        return this.graphNodes.findNode(nodeId);
    }

    findNodePort(nodeId: string, portId: string, portOut: boolean): GraphNodePortComponent | undefined {
        return this.graphNodes.findNode(nodeId)?.findPortComponent(portId, portOut);
    }

    addEventListener(listener: GraphEditorListener): GraphEditorListener {
        return this.events.addListener(listener);
    }

    removeEventListener(listener: GraphEditorListener): boolean {
        return this.events.removeListener(listener);
    }

    trigger(event: GraphEditorEvent): void {
        this.events.trigger(event);
    }

    get graph(): Graph {
        return this._graph;
    }

    get activePort(): PortDragTarget | undefined {
        return this._activePort;
    }

    get targetPort(): PortDragTarget | undefined {
        return this._targetPort;
    }
}
