import { StoreState } from "../types/storeTypes";
import { GraphTemplate } from "../types/graphTemplateTypes";
import { PortId } from "../editor/GraphNodePortRefs";
import { TargetPort } from "../types/graphTypes";

export function selectScrollX(state: StoreState) {
    return state.editor.scrollX;
}

export function selectScrollY(state: StoreState) {
    return state.editor.scrollY;
}

export function selectScrolling(state: StoreState) {
    return state.editor.scrolling;
}

export function selectGraph(state: StoreState) {
    return state.editor.graph;
}

export function selectPortDrag(state: StoreState) {
    return state.editor.portDrag;
}

export function selectGraphNodes(state: StoreState) {
    return state.editor.graph.nodes;
}

export function createTemplateIdSelector(templates: GraphTemplate[]) {
    return (state: StoreState) => {
        const graph = state.editor.graph;
        return templates.find(t => t.data === graph)?.id;
    };
}

export function selectContextMenu(state: StoreState) {
    return state.editor.contextMenu;
}

export function selectFormState(formId: string) {
    return (state: StoreState) => {
        return state.editor.forms[formId];
    };
}

export function selectNodeSelected(nodeId: string) {
    return (state: StoreState) => {
        return state.editor.selectedNode === nodeId;
    };
}

export function selectPortTargets(port: PortId) {
    return (state: StoreState): TargetPort[] | undefined => {
        const node = state.editor.graph.nodes[port.nodeId];
        if (!node) return;

        const ports = port.portOut ? node.ports.out : node.ports.in;
        return ports[port.portName];
    };
}
