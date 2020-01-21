import React, { useContext } from 'react';
import { GraphConfig } from "../types/graphConfigTypes";
import { GraphTemplate } from "../types/graphTemplateTypes";
import { GraphAction } from "../types/graphReducerTypes";

export type GraphContext<Ctx, Params> = {
    modalRoot: HTMLElement;
    graphConfig: GraphConfig<Ctx, Params>;
    templates: GraphTemplate[];
    dispatch: React.Dispatch<GraphAction>;
}

export const graphContext = React.createContext<GraphContext<any, any>>(null as any);

export function useGraphContext<Ctx, Params>(): GraphContext<Ctx, Params> {
    return useContext(graphContext);
}
