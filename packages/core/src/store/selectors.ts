import { StoreState } from "../types/storeTypes";
import { GraphTemplate } from "../types/graphTemplateTypes";
import { PortId } from "../editor/GraphNodePortRefs";
import { TargetPort, GraphNode } from "../types/graphTypes";

export function selectGraph(state: StoreState) {
    return state.editor.graph;
}

export function selectPortDrag(state: StoreState) {
    return state.editor.portDrag;
}

export function selectGraphNodes(state: StoreState) {
    return state.editor.graph.nodes;
}

export function selectSubNodeIds(parent?: string) {
    return (state: StoreState): string[] | undefined => {
        const graph = state.editor.graph;

        if (parent) {
            const parentNode = graph.nodes[parent];
            return parentNode?.subNodes;

        } else {
            return graph.nodeIds;
        }
    };
}

export function selectGraphNode(state: StoreState, nodeId: string): GraphNode | undefined {
    return state.editor.graph.nodes[nodeId];
}

export function selectGraphNodeName(state: StoreState, nodeId: string): string | undefined {
    const node = selectGraphNode(state, nodeId);
    return node?.name;
}

export function selectTemplateId(templates: GraphTemplate[]) {
    return (state: StoreState) => {
        const graph = state.editor.graph;
        return templates.find(t => t.data === graph)?.id;
    };
}

export function selectContextMenu(state: StoreState) {
    return state.editor.contextMenu;
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

export function createSubNodesSelector(parent?: string) {
    let prev: {
        subNodeIds: string[] | undefined;
        graphNodes: { [key: string]: GraphNode };
        subNodes: { [key: string]: GraphNode };
    } | undefined;

    const subNodeIdsSelector = selectSubNodeIds(parent);
    return (state: StoreState): { [key: string]: GraphNode } => {
        const graphNodes = selectGraphNodes(state);
        const subNodeIds = subNodeIdsSelector(state);

        // return previous if nothing changed
        if (prev && prev.subNodeIds === subNodeIds && prev.graphNodes === graphNodes) {
            return prev.subNodes;
        }

        let subNodes: { [key: string]: GraphNode } = {};

        // modified if sub-node ids changed
        let modified = prev ? prev.subNodeIds !== subNodeIds : true;

        // clone the "slice", checking for modifications on the way
        if (subNodeIds) {
            for (const nodeId of subNodeIds) {
                const node = graphNodes[nodeId];
                if (prev && prev.graphNodes[nodeId] !== node) {
                    modified = true;
                }
                subNodes[nodeId] = node;
            }
        }

        // use the previous value if nothing changed
        if (!modified) {
            subNodes = prev!.subNodes;
        }

        // set the previous state
        prev = { graphNodes, subNodes, subNodeIds };
        return subNodes;
    };
}
