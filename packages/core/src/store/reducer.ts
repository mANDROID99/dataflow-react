import produce from "immer";
import { v4 } from "uuid";

import { GraphEditorState, ContextMenuTargetType } from "../types/storeTypes";
import { GraphNode } from "../types/graphTypes";
import { clearPortTargets, createConnection } from "../utils/graph/connectionUtils";
import {
    GraphAction,
    GraphActionType,
    LoadGraphAction,
    AddNodeAction,
    DeleteNodeAction,
    CloneNodeAction,
    SetFieldValueAction,
    ShowContextMenuAction,
    UpdateScrollAction,
    SelectNodeAction,
    SetNodePosAction,
    SetNodeWidthAction,
    BeginPortDragAction,
    UpdatePortDragAction,
    SetPortDragTargetAction,
    ClearPortDragTargetAction,
    SetPortPosAction,
    ClearPortPosAction,
    ShowFormAction,
    HideFormAction,
    SubmitFormAction,
    ClearFormAction
} from "./actions";
import { comparePortRefs, getPortKeyFromRef } from "../utils/graph/portUtils";
import { createInitialState } from "./initialState";

const handlers: { [K in GraphActionType]?: (editorState: GraphEditorState, action: Extract<GraphAction, { type: K }>) => GraphEditorState  } = {
    [GraphActionType.LOAD_GRAPH]: produce((state: GraphEditorState, action: LoadGraphAction) => {
        state.graph = action.graph;
        state.portDrag = undefined;
        state.contextMenu = undefined;
        state.forms = {}; 
    }),

    [GraphActionType.ADD_NODE]: produce((state: GraphEditorState, action: AddNodeAction) => {
        const node = action.node;
        state.graph.nodes[action.nodeId] = node;
        state.contextMenu = undefined;
        state.selectedNode = undefined;
    }),

    [GraphActionType.DELETE_NODE]: produce((state: GraphEditorState, action: DeleteNodeAction) => {
        const graph = state.graph;
        const nodes = graph.nodes;
        const nodeId = action.nodeId;
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
    
            delete nodes[action.nodeId];
        }
    
        state.contextMenu = undefined;
        state.selectedNode = undefined;
    }),

    [GraphActionType.CLONE_NODE]: produce((state: GraphEditorState, action: CloneNodeAction) => {
        const graph = state.graph;
        const node = graph.nodes[action.nodeId];
    
        if (node) {
            const clone: GraphNode = {
                type: node.type,
                fields: node.fields,
                ports: {
                    in: {},
                    out: {}
                },
                width: node.width,
                x: node.x + 20,
                y: node.y + 20
            };
    
            const id = v4();
            graph.nodes[id] = clone;
        }
    
        state.contextMenu = undefined;
        state.selectedNode = undefined;
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

    [GraphActionType.UPDATE_SCROLL]: produce((state: GraphEditorState, action: UpdateScrollAction) => {
        state.scrollX = action.scrollX;
        state.scrollY = action.scrollY;
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
    }),

    [GraphActionType.SET_NODE_WIDTH]: produce((state: GraphEditorState, action: SetNodeWidthAction) => {
        const node = state.graph.nodes[action.nodeId];
        if (!node) return;
    
        node.width = action.width;
    }),

    [GraphActionType.BEGIN_PORT_DRAG]: produce((state: GraphEditorState, action: BeginPortDragAction) => {
        const port = action.port;
    
        // clear existing ports when an "in" port is dragged
        if (!port.portOut) {
            const graph = state.graph;
            const node = graph.nodes[port.nodeId];
    
            if (node) {
                const targets = node.ports.in[port.portId];
                if (targets) {
                    clearPortTargets(graph, targets, port.nodeId, port.portId, false);
                }
            }
        }
    
        state.portDrag = {
            port,
            dragX: action.dragX,
            dragY: action.dragY,
            target: undefined
        };
    }),

    [GraphActionType.UPDATE_PORT_DRAG]: produce((state: GraphEditorState, action: UpdatePortDragAction) => {
        const portDrag = state.portDrag;
    
        if (portDrag) {
            portDrag.dragX = action.dragX;
            portDrag.dragY = action.dragY;
        }
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
    
        if (portDrag && portDrag.target && comparePortRefs(portDrag.target, action.port)) {
            portDrag.target = undefined;
        }
    }),

    [GraphActionType.SET_PORT_POS]: produce((state: GraphEditorState, action: SetPortPosAction) => {
        const portKey = getPortKeyFromRef(action.port);

        state.ports[portKey] = {
            portX: action.x,
            portY: action.y
        };
    }),

    [GraphActionType.CLEAR_PORT_POS]: produce((state: GraphEditorState, action: ClearPortPosAction) => {
        const portKey = getPortKeyFromRef(action.port);
        delete state.ports[portKey];
    }),

    [GraphActionType.SHOW_FORM]: produce((state: GraphEditorState, action: ShowFormAction) => {
        state.forms[action.formId] = {
            show: true,
            value: action.value,
            params: action.params,
            onResult: action.onResult
        };
    }),

    [GraphActionType.HIDE_FORM]: produce((state: GraphEditorState, action: HideFormAction) => {
        const form = state.forms[action.formId];
    
        if (form) {
            form.show = false;
        }
    }),

    [GraphActionType.SUBMIT_FORM]: produce((state: GraphEditorState, action: SubmitFormAction) => {
        const form = state.forms[action.formId];
    
        if (form) {
            form.show = false;

            // TODO: dont store function in redux store!
            form.onResult(action.value);
        }
    }),
    
    [GraphActionType.CLEAR_FORM]: produce((state: GraphEditorState, action: ClearFormAction) => {
        state.forms[action.formId] = undefined;
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
