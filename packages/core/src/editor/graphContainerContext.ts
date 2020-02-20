import React, { useContext } from 'react';
import { GraphNodePortRefs } from "./GraphNodePortRefs";

export type GraphContainerContext = {
    container: React.RefObject<HTMLElement>;
    ports: GraphNodePortRefs;
    parentNodeId: string | undefined;
}

export const containerContext = React.createContext<GraphContainerContext>(null as any);

export function useContainerContext() {
    return useContext(containerContext);
}
