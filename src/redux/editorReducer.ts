import { createReducer } from "@reduxjs/toolkit";
import { EditorState } from "../types/storeTypes";
import { loadGraph, toggleTheme, setNodePos, beginPortDrag, setNodeDragPos, unmountNode, setPortDragPos, unmountPort, endPortDrag, setPortDragTarget, clearPortDragTarget, showConfigModal, setNodeConfig, mountNode, mountPort, cancelConfigModal } from "./editorActions";
import { getPortKeyFromRef, comparePortRefs } from "./editorSelectors";

function createInitialState(): EditorState {
    return {
        graph: {
            connections: [],
            nodeIds: [],
            nodes: {}
        },
        nodes: {},
        ports: {},
        theme: 'light'
    };
}

export default createReducer(createInitialState(), builder =>
    builder
        .addCase(loadGraph, (state, action) => {
            state.graph = action.payload.graph;
        })
        .addCase(toggleTheme, (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        })
        .addCase(setNodePos, (state, { payload }) => {
            const node = state.graph.nodes[payload.nodeId];
            if (!node) return;
            
            node.x = payload.x;
            node.y = payload.y;
        })
        .addCase(showConfigModal, (state, { payload }) => {
            state.configuring = payload.nodeId;
        })
        .addCase(cancelConfigModal, (state) => {
            state.configuring = undefined;
        })
        .addCase(setNodeConfig, (state, { payload }) => {
            const node = state.graph.nodes[payload.nodeId];

            // set the new config on the graph
            if (node) {
                node.config = payload.config;
            }

            // finish configuring the node
            if (payload.doneConfiguring) {
                state.configuring = undefined;
            }
        })
        .addCase(beginPortDrag, (state, { payload }) => {
            const nodeId = payload.nodeId;
            const portId = payload.portId;
            const portOut = payload.portOut;

            // Clear existing connections to this port
            const graph = state.graph;
            graph.connections = graph.connections.filter((conn) => {
                if (portOut) {
                    return conn.outNode !== nodeId || conn.outPort !== portId;
                } else {
                    return conn.inNode !== nodeId || conn.inPort !== portId;
                }
            });

            // begin drag
            state.portDrag = {
                nodeId,
                portId,
                portOut
            };
        })
        .addCase(endPortDrag, (state) => {
            let source = state.portDrag;
            if (!source) return;

            let target = source.target;
            if (target) {
                // swap the connection direction
                if (target.portOut) {
                    const tmp = target;
                    target = source;
                    source = tmp;
                }

                // create connection
                state.graph.connections.push({
                    outNode: source.nodeId,
                    outPort: source.portId,
                    inNode: target.nodeId,
                    inPort: target.portId
                });
            }

            state.portDrag = undefined;
        })
        
        .addCase(setPortDragTarget, (state, { payload }) => {
            const portDrag = state.portDrag;
            if (!portDrag) return;

            portDrag.target = {
                nodeId: payload.nodeId,
                portId: payload.portId,
                portOut: payload.portOut
            };
        })
        .addCase(clearPortDragTarget, (state, { payload }) => {
            const portDrag = state.portDrag;
            if (!portDrag) return;

            const target = portDrag.target;
            if (target && comparePortRefs(target, payload)) {
                portDrag.target = undefined;
            }
        })
        .addCase(mountNode, (state, { payload }) => {
            state.nodes[payload.nodeId] = {
                x: payload.x,
                y: payload.y
            }
        })
        .addCase(setNodeDragPos, (state, { payload }) => {
            const nodeState = state.nodes[payload.nodeId];
            if (!nodeState) return;
            
            nodeState.x = payload.x;
            nodeState.y = payload.y;
        })
        .addCase(unmountNode, (state, { payload }) => {
            delete state.nodes[payload.nodeId];
        })
        .addCase(mountPort, (state, { payload }) => {
            const portKey = getPortKeyFromRef(payload);
            state.ports[portKey] = {
                align: payload.align,
                x: payload.x,
                y: payload.y
            };
        })
        .addCase(setPortDragPos, (state, { payload }) => {
            const portKey = getPortKeyFromRef(payload);
            const portState = state.ports[portKey];
            if (!portState) return;

            portState.align = payload.align;
            portState.x = payload.x;
            portState.y = payload.y;
        })
        .addCase(unmountPort, (state, { payload }) => {
            const portKey = getPortKeyFromRef(payload);
            delete state.ports[portKey];
        })
);
