import React, { useContext } from 'react';
import { GraphConfig } from "../types/graphConfigTypes";
import { GraphTemplate } from "../types/graphTemplateTypes";

export type GraphContext<Ctx, Params> = {
    modalRoot: HTMLElement;
    graphConfig: GraphConfig<Ctx, Params>;
    templates: GraphTemplate[];
}

export const graphContext = React.createContext<GraphContext<any, any>>(null as any);

export function useGraphContext<Ctx, Params>(): GraphContext<Ctx, Params> {
    return useContext(graphContext);
}
