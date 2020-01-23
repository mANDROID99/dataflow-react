import { GraphEditorState, Receiver, ReceiverType } from "../../types/storeTypes";

export function receiveValue(state: GraphEditorState, value: unknown, receiver: Receiver) {
    if (receiver.type === ReceiverType.NODE_FIELD) {
        const node = state.graph.nodes[receiver.nodeId];

        if (node) {
            node.fields[receiver.fieldId] = value;
        }
    }
}
