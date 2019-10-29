
// state
export type NodeDragState = {
    nodeId: string;
    dx?: number;
    dy?: number;
}

export type PortDragState = {
    nodeId: string;
    portName: string;
    portOut: boolean;
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
    START_DRAG,
    UPDATE_DRAG,
    END_DRAG,
    MOUNT_PORT,
    UNMOUNT_PORT,
    START_PORT_DRAG,
}

export type GraphAction = 
    { type: GraphActionType.START_DRAG, nodeId: string } |
    { type: GraphActionType.UPDATE_DRAG, dragX: number, dragY: number } |
    { type: GraphActionType.END_DRAG } |
    { type: GraphActionType.MOUNT_PORT, portId: string, offX: number, offY: number } |
    { type: GraphActionType.UNMOUNT_PORT, portId: string } |
    { type: GraphActionType.START_PORT_DRAG, nodeId: string, portName: string, portOut: boolean };
