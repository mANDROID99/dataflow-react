import produce from "immer";

import { GraphAction, GraphState, GraphActionType } from "./types/graphStateTypes";
import { comparePortIds, portIdToKey } from "./graphHelpers";

export function init(): GraphState {
    return {
        portOffsets: {}
    };
}

export function reducer(state: GraphState, action: GraphAction): GraphState {
    switch (action.type) {
        case GraphActionType.DRAG_START:
            return produce(state, (draft) => {
                draft.nodeDrag = {
                    nodeId: action.nodeId
                };
            })

        case GraphActionType.DRAG_UPDATE:
            return produce(state, (draft) => {
                const drag = draft.nodeDrag;
                if (drag == null) return;

                drag.dx = action.dragX;
                drag.dy = action.dragY;
            });

        case GraphActionType.DRAG_END:
            return produce(state, (draft) => {
                draft.nodeDrag = undefined;
            });

        case GraphActionType.PORT_MOUNT:
            return produce(state, (draft) => {
                const portKey = portIdToKey(action.port);
                draft.portOffsets[portKey] = {
                    offX: action.offX,
                    offY: action.offY
                };
            });

        case GraphActionType.PORT_UNMOUNT:
            return produce(state, (draft) => {
                const portKey = portIdToKey(action.port);
                delete draft.portOffsets[portKey];
            });

        case GraphActionType.PORT_DRAG_SET:
            return produce(state, (draft) => {
                draft.portDrag = {
                    startPort: action.port
                };
            });

        case GraphActionType.PORT_DRAG_END:
            return produce(state, (draft) => {
                draft.portDrag = undefined;
            });

        case GraphActionType.PORT_DRAG_TARGET_SET:
            return produce(state, (draft) => {
                const drag = draft.portDrag;
                if (drag == null) return;
                drag.targetPort = action.port;
            });

        case GraphActionType.PORT_DRAG_TARGET_CLEAR:
            return produce(state, (draft) => {
                const drag = draft.portDrag;
                if (drag == null || !comparePortIds(drag.startPort, action.port)) return;
                drag.targetPort = undefined;
            })

        default:
            return state;
    }
}
