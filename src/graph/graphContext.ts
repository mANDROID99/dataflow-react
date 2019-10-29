import { createContext, Dispatch } from "react";
import { GraphSpec } from "./types/graphSpecTypes";
import { GraphAction } from "./types/graphStateTypes";

export type GraphActions = {
    onNodePosChanged(nodeId: string, x: number, y: number): void;
    onNodeFieldValueChanged(nodeId: string, fieldName: string, value: unknown): void;
    onNodeRemoved(nodeId: string): void;
}

export type GraphContext = {
    spec: GraphSpec;
    actions: GraphActions;
    dispatch: Dispatch<GraphAction>;
}

export const Context = createContext<GraphContext>(undefined!);
