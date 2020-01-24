import { StoreState } from "../types/storeTypes";
import { GraphTemplate } from "../types/graphTemplateTypes";
import { PortId } from "../editor/GraphNodePortRefs";
import { TargetPort } from "../types/graphTypes";

export function selectScrollX(state: StoreState) {
    return state.graphEditor.scrollX;
}

export function selectScrollY(state: StoreState) {
    return state.graphEditor.scrollY;
}

export function selectGraph(state: StoreState) {
    return state.graphEditor.graph;
}

export function selectPortDrag(state: StoreState) {
    return state.graphEditor.portDrag;
}

export function selectGraphNodes(state: StoreState) {
    return state.graphEditor.graph.nodes;
}

export function createTemplateIdSelector(templates: GraphTemplate[]) {
    return (state: StoreState) => {
        const graph = state.graphEditor.graph;
        return templates.find(t => t.graph === graph)?.id;
    };
}

export function selectContextMenu(state: StoreState) {
    return state.graphEditor.contextMenu;
}

export function selectFormState(formId: string) {
    return (state: StoreState) => {
        return state.graphEditor.forms[formId];
    };
}

export function selectNodeSelected(nodeId: string) {
    return (state: StoreState) => {
        return state.graphEditor.selectedNode === nodeId;
    };
}

export function selectPortTargets(port: PortId) {
    return (state: StoreState): TargetPort[] | undefined => {
        const node = state.graphEditor.graph.nodes[port.nodeId];
        if (!node) return;

        const ports = port.portOut ? node.ports.out : node.ports.in;
        return ports[port.portName];
    };
}
