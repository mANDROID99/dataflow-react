import { Graph } from "../types/graphTypes";
import { createAction } from "@reduxjs/toolkit";
import { PortAlign } from "../types/graphDefTypes";

export const loadGraph = createAction('editor/LOAD_GRAPH', (graph: Graph) => ({ payload: { graph }}));

export const toggleTheme = createAction('editor/TOGGLE_THEME');

export const setNodePos = createAction('editor/SET_NODE_POS', (nodeId: string, x: number, y: number) => ({ payload: { nodeId, x, y }}));

export const showConfigModal = createAction('editor/SHOW_CONFIG_MODAL', (nodeId: string) => ({ payload: { nodeId }}));

export const cancelConfigModal = createAction('editor/CANCEL_CONFIG_MODAL');

export const setNodeConfig = createAction('editor/SET_NODE_CONFIG', (nodeId: string, config: unknown, doneConfiguring: boolean) => ({ payload: { nodeId, config, doneConfiguring }}));

export const beginPortDrag = createAction('editor/BEGIN_PORT_DRAG', (nodeId: string, portId: string, portOut: boolean) => ({ payload: { nodeId, portId, portOut }}));

export const endPortDrag = createAction('editor/END_PORT_DRAG');

export const setPortDragTarget = createAction('editor/SET_PORT_DRAG_TARGET', (nodeId: string, portId: string, portOut: boolean) => ({ payload: { nodeId, portId, portOut }}));

export const clearPortDragTarget = createAction('editor/CLEAR_PORT_DRAG_TARGET', (nodeId: string, portId: string, portOut: boolean) => ({ payload: { nodeId, portId, portOut }}));

export const mountNode = createAction('editor/MOUNT_NODE', (nodeId: string, x: number, y: number) => ({ payload: { nodeId, x, y }}));

export const setNodeDragPos = createAction('editor/SET_NODE_DRAG_POS', (nodeId: string, x: number, y: number) => ({ payload: { nodeId, x, y }}));

export const unmountNode = createAction('editor/UNMOUNT_NODE', (nodeId: string) => ({ payload: { nodeId }}));

export const mountPort = createAction('editor/MOUNT_PORT', (nodeId: string, portId: string, portOut: boolean, align: PortAlign, x: number, y: number) => ({ payload: { nodeId, portId, portOut, align, x, y }}));

export const setPortDragPos = createAction('editor/SET_PORT_DRAG_POS', (nodeId: string, portId: string, portOut: boolean, align: PortAlign, x: number, y: number) => ({ payload: { nodeId, portId, portOut, align, x, y }}));

export const unmountPort = createAction('editor/UNMOUNT_PORT', (nodeId: string, portId: string, portOut: boolean) => ({ payload: { nodeId, portId, portOut }}));
