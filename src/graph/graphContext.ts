import { createContext, Dispatch } from "react";
import { GraphNode } from "./types/graphTypes";
import { GraphSpec } from "./types/graphSpecTypes";
import { GraphAction } from "./types/graphStateTypes";

export type GraphActions = {
    onNodeRemoved(nodeId: string): void;
    onNodeChanged(nodeId: string, node: GraphNode): void;
    onNodeCreated(nodeId: string, node: GraphNode): void;
}

export type GraphContext = {
    spec: GraphSpec;
    actions: GraphActions;
    dispatch: Dispatch<GraphAction>;
}

export const Context = createContext<GraphContext>(undefined!);
