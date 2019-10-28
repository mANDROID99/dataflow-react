import { createContext, Dispatch } from "react";
import { GraphSpec, GraphActions } from "./graphTypes";
import { Action } from "./graphStateReducer";

export type GraphContext = {
    spec: GraphSpec;
    actions: GraphActions;
    dispatch: Dispatch<Action>;
}

export const Context = createContext<GraphContext>(undefined!);
