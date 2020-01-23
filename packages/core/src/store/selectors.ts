import { StoreState } from "../types/storeTypes";
import { GraphTemplate } from "../types/graphTemplateTypes";

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

export function selectPorts(state: StoreState) {
    return state.graphEditor.ports;
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
