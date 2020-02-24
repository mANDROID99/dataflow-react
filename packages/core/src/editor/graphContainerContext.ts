import React, { useContext } from 'react';
import { GraphNodePortRefs } from "./GraphNodePortRefs";

export type GraphContainerContext = {
    parentNodeId: string | undefined;
    ports: GraphNodePortRefs;
}

export const containerContext = React.createContext<GraphContainerContext>(null as any);

export function useContainerContext() {
    return useContext(containerContext);
}
