import { createContext, Dispatch } from "react";
import { GraphSpec } from "./types/graphSpecTypes";
import { GraphAction } from "./types/graphStateTypes";
import { PortId } from "./graphHelpers";

export type GraphActions = {
    onNodePosChanged(nodeId: string, x: number, y: number): void;
    onNodeFieldValueChanged(nodeId: string, fieldName: string, value: unknown): void;
    onNodeRemoved(nodeId: string): void;
    onNodeConnectionRemoved(start: PortId): void;
    onNodeConnectionCreated(start: PortId, end: PortId): void;
}

export type GraphContext = {
    spec: GraphSpec;
    actions: GraphActions;
    dispatch: Dispatch<GraphAction>;
}

export const Context = createContext<GraphContext>(undefined!);
