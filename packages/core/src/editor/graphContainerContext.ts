import React, { useContext } from 'react';
import { GraphNodePortRefs } from "./GraphNodePortRefs";

export type Pos = {
    x: number;
    y: number;
}

export type GraphContainerContext = {
    scrollOffset: React.MutableRefObject<Pos>;
    parentNodeId: string | undefined;
    ports: GraphNodePortRefs;
}

export const containerContext = React.createContext<GraphContainerContext>(null as any);

export function useContainerContext() {
    return useContext(containerContext);
}
