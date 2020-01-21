import produce from "immer";
import { v4 } from 'uuid';

import { Graph, GraphNode } from "../types/graphTypes";
import {
    GraphState,
    GraphAction,
    ShowContextMenuAction,
    GraphActionType,
    UpdateScrollAction,
    SelectNodeAction,
    DeleteNodeAction,
    CreateNodeAction,
    SetFieldValueAction,
    SetNodePosAction,
    BeginPortDragAction,
    UpdatePortDragAction,
    SetPortDragTargetAction,
    ClearPortDragTargetAction,
    SetPortPosAction,
    ClearPortPosAction,
    ShowFormAction,
    ContextMenuTargetType,
    CopyNodeAction,
    SubmitFormAction,
    ClearFormAction,
    HideFormAction,
    LoadGraphAction,
    SetNodeWidthAction
} from "../types/graphReducerTypes";
import { GraphConfig } from "../types/graphConfigTypes";
import { createGraphNode } from "../utils/graph/graphNodeFactory";
import { comparePortRefs, getPortKeyFromRef } from "../utils/graph/portUtils";
import { createConnection, clearPortTargets } from "../utils/graph/connectionUtils";

function emptyGraph(): Graph {
    return {
        nodes: {}
    };
}

export function init(graph: Graph | undefined): GraphState {
    if (!graph) {
        graph = emptyGraph();
    }

    return {
        graph,
        contextMenu: undefined,
        scrollX: 0,
        scrollY: 0,
        selectedNode: undefined,
        portDrag: undefined,
        ports: {},
        forms: {}
    };
}

const handleLoadGraphTemplate = produce((state: GraphState, action: LoadGraphAction) => {
    state.graph = action.graph;
    state.portDrag = undefined;
    state.contextMenu = undefined;
    state.forms = {};  
});

const handleCreateNode = produce((state: GraphState, action: CreateNodeAction, config: GraphConfig<any>) => {
    const x = action.x - state.scrollX;
    const y = action.y - state.scrollY;
    const graphNode = createGraphNode(x, y, action.nodeType, config);

    const id = v4();
    state.graph.nodes[id] = graphNode;

    state.contextMenu = undefined;
    state.selectedNode = undefined;
});

const handleDeleteNode = produce((state: GraphState, action: DeleteNodeAction) => {
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
});

const handleCopyNode = produce((state: GraphState, action: CopyNodeAction) => {
    const graph = state.graph;
    const node = graph.nodes[action.nodeId];

    if (node) {
        const nodeCopy: GraphNode = {
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
        graph.nodes[id] = nodeCopy;
    }

    state.contextMenu = undefined;
    state.selectedNode = undefined;
});

const handleSetFieldValue = produce((state: GraphState, action: SetFieldValueAction) => {
    const node = state.graph.nodes[action.nodeId];
    if (!node) return;
    
    node.fields[action.fieldName] = action.value;
});

const handleShowContextMenu = produce((state: GraphState, action: ShowContextMenuAction) => {
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
});

const handleHideContextMenu = produce((state: GraphState) => {
    state.contextMenu = undefined;
});

const handleUpdateScroll = produce((state: GraphState, action: UpdateScrollAction) => {
    state.scrollX = action.scrollX;
    state.scrollY = action.scrollY;
});

const handleSetSelectedNode = produce((state: GraphState, action: SelectNodeAction) => {
    state.selectedNode = action.nodeId;
});

const handleClearSelectedNode = produce((state: GraphState) => {
    state.selectedNode = undefined;
});

const handleSetNodePos = produce((state: GraphState, action: SetNodePosAction) => {
    const node = state.graph.nodes[action.nodeId];
    if (!node) return;

    node.x = action.x;
    node.y = action.y;
});

const handleSetNodeWidth = produce((state: GraphState, action: SetNodeWidthAction) => {
    const node = state.graph.nodes[action.nodeId];
    if (!node) return;

    node.width = action.width;
});

const handleBeginPortDrag = produce((state: GraphState, action: BeginPortDragAction) => {
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
});

const handleUpdatePortDrag = produce((state: GraphState, action: UpdatePortDragAction) => {
    const portDrag = state.portDrag;

    if (portDrag) {
        portDrag.dragX = action.dragX;
        portDrag.dragY = action.dragY;
    }
});

const handleEndPortDrag = produce((state: GraphState, config: GraphConfig<any>) => {
    const portDrag = state.portDrag;

    if (portDrag) {
        const port = portDrag.port;
        const target = portDrag.target;
        
        if (target) {
            createConnection(state.graph, config, port, target);
        }

        state.portDrag = undefined;
    }
});

const handleSetPortDragTarget = produce((state: GraphState, action: SetPortDragTargetAction) => {
    const portDrag = state.portDrag;
    
    if (portDrag) {
        portDrag.target = action.port;
    }
});

const handleClearPortDragTarget = produce((state: GraphState, action: ClearPortDragTargetAction) => {
    const portDrag = state.portDrag;

    if (portDrag && portDrag.target && comparePortRefs(portDrag.target, action.port)) {
        portDrag.target = undefined;
    }
});

const handleSetPortPos = produce((state: GraphState, action: SetPortPosAction) => {
    const portKey = getPortKeyFromRef(action.port);
    state.ports[portKey] = {
        portX: action.x,
        portY: action.y
    };
});

const handleClearPortPos = produce((state: GraphState, action: ClearPortPosAction) => {
    const portKey = getPortKeyFromRef(action.port);
    delete state.ports[portKey];
});

const handleShowForm = produce((state: GraphState, action: ShowFormAction) => {
    state.forms[action.formId] = {
        show: true,
        value: action.value,
        params: action.params,
        onResult: action.onResult
    };
});

const handleHideForm = produce((state: GraphState, action: HideFormAction) => {
    const form = state.forms[action.formId];

    if (form) {
        form.show = false;
    }
});

const handleSubmitForm = produce((state: GraphState, action: SubmitFormAction) => {
    const form = state.forms[action.formId];

    if (form) {
        form.show = false;
        form.onResult(action.value);
    }
});

const handleClearForm = produce((state: GraphState, action: ClearFormAction) => {
    state.forms[action.formId] = undefined;
});

export function reducer(config: GraphConfig<any, any>) {
    return (state: GraphState, action: GraphAction): GraphState => {
        switch (action.type) {
            case GraphActionType.LOAD_GRAPH:
                return handleLoadGraphTemplate(state, action);

            case GraphActionType.CREATE_NODE:
                return handleCreateNode(state, action, config);

            case GraphActionType.DELETE_NODE:
                return handleDeleteNode(state, action);

            case GraphActionType.COPY_NODE:
                return handleCopyNode(state, action);

            case GraphActionType.SET_FIELD_VALUE:
                return handleSetFieldValue(state, action);

            case GraphActionType.SELECT_NODE:
                return handleSetSelectedNode(state, action);

            case GraphActionType.CLEAR_SELECTED_NODE:
                return handleClearSelectedNode(state);

            case GraphActionType.SHOW_CONTEXT_MENU:
                return handleShowContextMenu(state, action);

            case GraphActionType.HIDE_CONTEXT_MENU:
                return handleHideContextMenu(state);

            case GraphActionType.UPDATE_SCROLL:
                return handleUpdateScroll(state, action);

            case GraphActionType.SET_NODE_POS:
                return handleSetNodePos(state, action);

            case GraphActionType.SET_NODE_WIDTH:
                return handleSetNodeWidth(state, action);

            case GraphActionType.BEGIN_PORT_DRAG:
                return handleBeginPortDrag(state, action);

            case GraphActionType.UPDATE_PORT_DRAG:
                return handleUpdatePortDrag(state, action);

            case GraphActionType.END_PORT_DRAG:
                return handleEndPortDrag(state, config);

            case GraphActionType.SET_PORT_DRAG_TARGET:
                return handleSetPortDragTarget(state, action);

            case GraphActionType.CLEAR_PORT_DRAG_TARGET:
                return handleClearPortDragTarget(state, action);

            case GraphActionType.SET_PORT_POS:
                return handleSetPortPos(state, action);

            case GraphActionType.CLEAR_PORT_POS:
                return handleClearPortPos(state, action);

            case GraphActionType.SHOW_FORM:
                return handleShowForm(state, action);

            case GraphActionType.HIDE_FORM:
                return handleHideForm(state, action);

            case GraphActionType.CLEAR_FORM:
                return handleClearForm(state, action);

            case GraphActionType.SUBMIT_FORM:
                return handleSubmitForm(state, action);

            default:
                return state;
        }
    };
}
