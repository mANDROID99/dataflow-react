import produce from "immer";

import { GraphAction, GraphState, GraphActionType } from "./types/graphStateTypes";

export function init(): GraphState {
    return {
        portOffsets: {}
    };
}

export function reducer(state: GraphState, action: GraphAction): GraphState {
    switch (action.type) {
        case GraphActionType.START_DRAG:
            return produce(state, (draft) => {
                draft.nodeDrag = {
                    nodeId: action.nodeId
                };
            })

        case GraphActionType.UPDATE_DRAG:
            return produce(state, (draft) => {
                const drag = draft.nodeDrag;
                if (drag == null) return;

                drag.dx = action.dragX;
                drag.dy = action.dragY;
            });

        case GraphActionType.END_DRAG:
            return produce(state, (draft) => {
                draft.nodeDrag = undefined;
            });

        case GraphActionType.MOUNT_PORT:
            return produce(state, (draft) => {
                draft.portOffsets[action.portId] = {
                    offX: action.offX,
                    offY: action.offY
                };
            });

        case GraphActionType.UNMOUNT_PORT:
            return produce(state, (draft) => {
                delete draft.portOffsets[action.portId];
            });

        case GraphActionType.START_PORT_DRAG:
            return produce(state, (draft) => {
                draft.portDrag = {
                    nodeId: action.nodeId,
                    portName: action.portName,
                    portOut: action.portOut
                };
            });

        case GraphActionType.END_PORT_DRAG:
            return produce(state, (draft) => {
                draft.portDrag = undefined;
            })

        default:
            return state;
    }
}
