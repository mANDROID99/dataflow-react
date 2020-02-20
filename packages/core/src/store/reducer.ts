import produce from "immer";
import { v4 } from "uuid";

import { GraphEditorState, ContextMenuTargetType } from "../types/storeTypes";
import { GraphNode } from "../types/graphTypes";
import { clearPortTargets, createConnection } from "../utils/store/connectionUtils";
import {
    GraphAction,
    GraphActionType,
    LoadGraphAction,
    AddNodeAction,
    DeleteNodeAction,
    CloneNodeAction,
    SetFieldValueAction,
    ShowContextMenuAction,
    SelectNodeAction,
    SetNodePosAction,
    SetNodeWidthAction,
    BeginPortDragAction,
    SetPortDragTargetAction,
    ClearPortDragTargetAction,
    SetNodeCollapsedAction,
    SetNodeNameAction,
    SetNodeBoundsAction,
    MoveOverlappingBoundsAction,
    SetNodeSizeAction
} from "./actions";
import { comparePortTargets } from "../utils/graph/portUtils";
import { createInitialState } from "./initialState";
import { clearAlignment, updateBoundsOverlapping } from "./boundsUpdater";

const OVERLAP_MARGIN = 5;

const handlers: { [K in GraphActionType]?: (editorState: GraphEditorState, action: Extract<GraphAction, { type: K }>) => GraphEditorState  } = {
    [GraphActionType.LOAD_GRAPH]: produce((state: GraphEditorState, action: LoadGraphAction) => {
        state.graph = action.graph;
        state.bounds = {};
        state.portDrag = undefined;
        state.contextMenu = undefined;
    }),

    [GraphActionType.ADD_NODE]: produce((state: GraphEditorState, { node, parent }: AddNodeAction) => {
        const graph = state.graph;
        node.parent = parent;
        graph.nodes[node.id] = node;

        state.contextMenu = undefined;
        state.selectedNode = undefined;

        // register node-id with parent
        if (parent) {
            const parentNode = graph.nodes[parent];
            if (parentNode) {
                const subNodes = parentNode.subNodes;
                if (subNodes) {
                    subNodes.push(node.id);
                } else {
                    parentNode.subNodes = [node.id];
                }
            }
        } else {
            graph.nodeIds.push(node.id);
        }
    }),

    [GraphActionType.DELETE_NODE]: produce((state: GraphEditorState, { nodeId }: DeleteNodeAction) => {
        const graph = state.graph;
        const nodes = graph.nodes;
        const node = nodes[nodeId];
        
        if (node) {
            // clear out ports
            for (const portId in node.ports.out) {
                const targets = node.ports.out[portId];
                if (targets) {
                    clearPortTargets(graph, targets, nodeId, portId, true);
                }
            }
    
            // clear in ports
            for (const portId in node.ports.in) {
                const targets = node.ports.in[portId];
                if (targets) {
                    clearPortTargets(graph, targets, nodeId, portId, false);
                }
            }
    
            delete nodes[nodeId];

            // unregister node-id from parent
            if (node.parent) {
                const parentNode = graph.nodes[node.parent];
                if (parentNode) {
                    const subNodes = parentNode.subNodes;
                    if (subNodes) {
                        const i = subNodes.indexOf(nodeId);
                        if (i >= 0) {
                            subNodes.splice(i, 1);
                        }
                    }
                }
                
            } else {
                const nodeIds = graph.nodeIds;
                const i = nodeIds.indexOf(nodeId);
                if (i >= 0) {
                    nodeIds.splice(i, 1);
                }
            }
        }
    
        state.contextMenu = undefined;
        state.selectedNode = undefined;

        // clear node bounds
        clearAlignment(state.bounds, nodeId);
        delete state.bounds[nodeId];
    }),

    [GraphActionType.CLONE_NODE]: produce((state: GraphEditorState, action: CloneNodeAction) => {
        const graph = state.graph;
        const node = graph.nodes[action.nodeId];
    
        if (node) {
            const id = v4();

            const clone: GraphNode = {
                id,
                name: node.name,
                type: node.type,
                fields: node.fields,
                ports: {
                    in: {},
                    out: {}
                },
                width: node.width,
                height: node.height,
                x: node.x + 20,
                y: node.y + 20
            };

            graph.nodes[id] = clone;
        }
    
        state.contextMenu = undefined;
        state.selectedNode = undefined;
    }),

    [GraphActionType.SET_NODE_NAME]: produce((state: GraphEditorState, action: SetNodeNameAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
        node.name = action.name;
    }),

    [GraphActionType.SET_FIELD_VALUE]: produce((state: GraphEditorState, action: SetFieldValueAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
        node.fields[action.fieldName] = action.value;
    }),

    [GraphActionType.SHOW_CONTEXT_MENU]: produce((state: GraphEditorState, action: ShowContextMenuAction) => {
        const target = action.target;
    
        if (target) {
            if (target.type === ContextMenuTargetType.GRAPH_NODE) {
                state.selectedNode = target.nodeId;
            }

        } else {
            state.selectedNode = undefined;
        }
    
        state.contextMenu = {
            x: action.x,
            y: action.y,
            target
        };
    }),

    [GraphActionType.HIDE_CONTEXT_MENU]: produce((state: GraphEditorState) => {
        state.contextMenu = undefined;
    }),

    [GraphActionType.SELECT_NODE]: produce((state: GraphEditorState, action: SelectNodeAction) => {
        state.selectedNode = action.nodeId;
    }),

    [GraphActionType.CLEAR_SELECTED_NODE]: produce((state: GraphEditorState) => {
        state.selectedNode = undefined;
    }),

    [GraphActionType.SET_NODE_POS]:  produce((state: GraphEditorState, action: SetNodePosAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
        node.x = action.x;
        node.y = action.y;
        clearAlignment(state.bounds, action.nodeId);
    }),

    [GraphActionType.SET_NODE_WIDTH]: produce((state: GraphEditorState, action: SetNodeWidthAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
        node.width = action.width;
    }),

    [GraphActionType.SET_NODE_SIZE]: produce((state: GraphEditorState, action: SetNodeSizeAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
        node.width = action.width;
        node.height = action.height;
    }),

    [GraphActionType.SET_NODE_COLLAPSED]: produce((state: GraphEditorState, action: SetNodeCollapsedAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
        node.collapsed = action.collapsed;
    }),

    [GraphActionType.BEGIN_PORT_DRAG]: produce((state: GraphEditorState, action: BeginPortDragAction) => {
        const port = action.port;
    
        // clear existing ports when an "in" port is dragged
        if (!port.portOut) {
            const graph = state.graph;
            const node = graph.nodes[port.nodeId];
    
            if (node) {
                const targets = node.ports.in[port.portName];
                if (targets) {
                    clearPortTargets(graph, targets, port.nodeId, port.portName, false);
                }
            }
        }
    
        state.portDrag = {
            port,
            target: undefined
        };
    }),

    [GraphActionType.END_PORT_DRAG]: produce((state: GraphEditorState) => {
        const portDrag = state.portDrag;
    
        if (portDrag) {
            const port = portDrag.port;
            const target = portDrag.target;
            
            if (target) {
                createConnection(state.graph, port, target);
            }
    
            state.portDrag = undefined;
        }
    }),

    [GraphActionType.SET_PORT_DRAG_TARGET]: produce((state: GraphEditorState, action: SetPortDragTargetAction) => {
        const portDrag = state.portDrag;
        
        if (portDrag) {
            portDrag.target = action.port;
        }
    }),

    [GraphActionType.CLEAR_PORT_DRAG_TARGET]: produce((state: GraphEditorState, action: ClearPortDragTargetAction) => {
        const portDrag = state.portDrag;
    
        if (portDrag && portDrag.target && comparePortTargets(portDrag.target, action.port)) {
            portDrag.target = undefined;
        }
    }),
    
    [GraphActionType.SET_NODE_BOUNDS]: produce((state: GraphEditorState, action: SetNodeBoundsAction) => {
        const bounds = state.bounds[action.nodeId];
        if (bounds) {
            bounds.x = action.x;
            bounds.y = action.y;
            bounds.width = action.width;
            bounds.height = action.height;

        } else {
            state.bounds[action.nodeId] = {
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height
            };
        }        
    }),

    [GraphActionType.MOVE_OVERLAPPING_BOUNDS]: produce((state: GraphEditorState, action: MoveOverlappingBoundsAction) => {
        const updated = updateBoundsOverlapping(state.bounds, action.nodeId, OVERLAP_MARGIN);

        for (const updatedId of updated) {
            const node = state.graph.nodes[updatedId];
            const nodeBounds = state.bounds[updatedId];

            if (node && nodeBounds) {
                node.y = nodeBounds.y;
                node.x = nodeBounds.x;
            }
        }
    })
};

export function reducer(state: GraphEditorState | undefined, action: GraphAction): GraphEditorState {
    if (state == null) {
        state = createInitialState();
    }

    const handler = handlers[action.type];

    if (handler) {
        return handler(state, action as any);
    }

    return state;
}
