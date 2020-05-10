import { StoreState, PortDragState, PortRef } from "../types/storeTypes";
import { Connection, GraphNode } from "../types/graphTypes";
import { PortAlign, GraphDef, PortDef } from "../types/graphDefTypes";

export enum DragStatus {
    NO_ACTIVE_DRAG,
    CANDIDATE,
    NON_CANDIDATE,
    DRAGGING,
    DRAG_TARGET
}

export type PortPos = {
    align: PortAlign;
    x: number;
    y: number;
}

export function getPortPos(state: StoreState, nodeId: string, portKey: string): PortPos | undefined {
    const node = state.editor.nodes[nodeId];
    if (!node) return;
    
    const port = state.editor.ports[portKey];
    if (!port) return;

    const x = node.x + port.x;
    const y = node.y + port.y;
    const align = port.align;
    return { x, y, align };
}

export function getPortKey(nodeId: string, portId: string, portOut: boolean) {
    return nodeId + '__' + portId + '__' + (portOut ? 'out' : 'in');
}

export function getPortKeyFromRef(ref: PortRef) {
    return getPortKey(ref.nodeId, ref.portId, ref.portOut);
}

export function comparePortRef(portRef: PortRef, nodeId: string, portId: string, portOut: boolean) {
    return portRef.nodeId === nodeId && portRef.portId === portId && portRef.portOut === portOut;
}

export function comparePortRefs(a: PortRef, b: PortRef) {
    return comparePortRef(a, b.nodeId, b.portId, b.portOut);
}

export function selectGraphNodeIds(state: StoreState): string[] {
    return state.editor.graph.nodeIds;
}

export function selectGraph(state: StoreState) {
    return state.editor.graph;
}

export function selectGraphNode(nodeId: string) {
    return (state: StoreState): GraphNode => state.editor.graph.nodes[nodeId];
}

export function selectGraphConnections(state: StoreState): Connection[] {
    return state.editor.graph.connections;
}

export function selectPortDrag(state: StoreState): PortDragState | undefined {
    return state.editor.portDrag;
}

export function selectTheme(state: StoreState): string {
    return state.editor.theme;
}

export function selectConfiguringNode(state: StoreState): string | undefined {
    return state.editor.configuring;
}

export function selectPortState(nodeId: string, portId: string, portOut: boolean) {
    const portKey = getPortKey(nodeId, portId, portOut);
    return (state: StoreState) => state.editor.ports[portKey];
}

export function selectPortPos(nodeId: string, portId: string, portOut: boolean) {
    const portKey = getPortKey(nodeId, portId, portOut);
    return (state: StoreState): PortPos | undefined => {
        return getPortPos(state, nodeId, portKey);
    }
}

export function selectPortDragTargetPos(state: StoreState): PortPos | undefined {
    const portDrag = state.editor.portDrag;
    if (!portDrag) return;

    const target = portDrag.target;
    if (!target) return;

    const portKey = getPortKeyFromRef(target);
    return getPortPos(state, target.nodeId, portKey);
}

export function comparePortPos(prev: PortPos | undefined, next: PortPos | undefined): boolean {
    if (!prev || !next) {
        return prev === next;
    }  else {
        return prev.x === next.x && prev.y === next.y && prev.align === next.align;
    }
}

function getPortDef(graphDef: GraphDef, state: StoreState, nodeId: string, portId: string, portOut: boolean): PortDef | undefined {
    const nodes = state.editor.graph.nodes;
    const node = nodes[nodeId];
    if (!node) return;

    const nodeDef = graphDef.nodes[node.type];
    if (!nodeDef) return;

    const ports = portOut ? nodeDef.ports.out : nodeDef.ports.in;
    return ports[portId];
}

export function selectPortDragStatus(graphDef: GraphDef, nodeId: string, portId: string, portOut: boolean) {
    return (state: StoreState): DragStatus => {
        const portDrag = state.editor.portDrag;
        if (!portDrag) {
            return DragStatus.NO_ACTIVE_DRAG;
        }

        if (comparePortRef(portDrag, nodeId, portId, portOut)) {
            return DragStatus.DRAGGING;
        }

        const target = portDrag.target;
        if (target && comparePortRef(target, nodeId, portId, portOut)) {
            return DragStatus.DRAG_TARGET;
        }

        let isCandidate = false;

        // check port direction
        if (portDrag.portOut !== portOut) {
            const portDef = getPortDef(graphDef, state, nodeId, portId, portOut);
            const dragPortDef = getPortDef(graphDef, state, portDrag.nodeId, portDrag.portId, portDrag.portOut);

            // check port types
            if (portDef && dragPortDef) {
                const typeA = portDef.type;
                const typeB = dragPortDef.type;

                if (typeA === null || typeB === null) {
                    isCandidate = true;

                } else {
                    if (typeof typeA === 'string') {
                        if (typeof typeB === 'string') {
                            isCandidate = typeA === typeB;

                        } else {
                            isCandidate = typeB.indexOf(typeA) >= 0;
                        }
                    } else {
                        if (typeof typeB === 'string') {
                            isCandidate = typeA.indexOf(typeB) >= 0;

                        } else {
                            isCandidate = typeA.some(ta => typeB.indexOf(ta) >= 0);
                        }
                    }
                }
            }   
        }
        
        return isCandidate ? DragStatus.CANDIDATE : DragStatus.NON_CANDIDATE;
    };
}
