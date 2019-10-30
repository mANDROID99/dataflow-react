import { PortId } from "../graphHelpers"

// state
export type NodeDragState = {
    nodeId: string;
    dx?: number;
    dy?: number;
}


export type PortDragState = {
    startPort: PortId;
    targetPort?: PortId;
}

export type PortOffset = {
    offX: number;
    offY: number;
}

export type GraphState = {
    nodeDrag?: NodeDragState;
    portDrag?: PortDragState;
    portOffsets: {
        [portId: string]: PortOffset | undefined;
    }
}

// actions

export enum GraphActionType {
    DRAG_START,
    DRAG_UPDATE,
    DRAG_END,
    PORT_MOUNT,
    PORT_UNMOUNT,
    PORT_DRAG_SET,
    PORT_DRAG_END,
    PORT_DRAG_TARGET_SET,
    PORT_DRAG_TARGET_CLEAR
}

export type GraphAction = 
    | { type: GraphActionType.DRAG_START, nodeId: string }
    | { type: GraphActionType.DRAG_UPDATE, dragX: number, dragY: number }
    | { type: GraphActionType.DRAG_END }
    | { type: GraphActionType.PORT_MOUNT, port: PortId, offX: number, offY: number }
    | { type: GraphActionType.PORT_UNMOUNT, port: PortId }
    | { type: GraphActionType.PORT_DRAG_SET, port: PortId }
    | { type: GraphActionType.PORT_DRAG_END }
    | { type: GraphActionType.PORT_DRAG_TARGET_SET, port: PortId }
    | { type: GraphActionType.PORT_DRAG_TARGET_CLEAR, port: PortId };
