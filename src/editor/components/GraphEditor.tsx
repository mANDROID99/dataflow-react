import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GraphConfig } from '../../types/graphConfigTypes';
import GraphNodeComponent from './GraphNode';
import { selectGraphNodes } from '../selectors';
import GraphSVG from './GraphSVG';
import Menu from './menu/Menu';
import { StoreState } from '../../types/storeTypes';

type Props<Ctx> = {
    graphId: string;
    graphConfig: GraphConfig<Ctx>;
    baseContext: Ctx;
}

export type GraphContext<Ctx> = {
    graphId: string;
    graphConfig: GraphConfig<Ctx>;
    modalRoot: Element;
    baseContext: Ctx;
}

export const graphContext = React.createContext<GraphContext<any>>(null as any);

function createModalRootDiv(): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'modal-root';
    return el;
}

export default function GraphEditor<Ctx>({ graphId, graphConfig, baseContext }: Props<Ctx>) {
    const [scroll, setScroll] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [modalRoot] = useState(createModalRootDiv);
    const graphContainerRef = useRef<HTMLDivElement>(null);

    const graphNodes = useSelector((state: StoreState) => selectGraphNodes(state, graphId));

    useEffect(() => {
        const container = graphContainerRef.current;
        if (!container) return;
        container.appendChild(modalRoot);
        return (): void => {
            container.removeChild(modalRoot);
        };
    }, [modalRoot]);

    const context = useMemo((): GraphContext<Ctx> => {
        return {
            graphId,
            graphConfig,
            modalRoot,
            baseContext
        };
    }, [graphId, graphConfig, modalRoot, baseContext]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const el = event.target as HTMLDivElement;
        setScroll({ x: el.scrollLeft, y: el.scrollTop });
    };

    return (
        <graphContext.Provider value={context}>
            <div ref={graphContainerRef} className="graph">
                <GraphSVG graphId={graphId} scroll={scroll}/>
                <div className="graph-nodes" onScroll={handleScroll}>
                    {(graphNodes ? Object.keys(graphNodes) : []).map(nodeId => (
                        <GraphNodeComponent
                            key={nodeId}
                            nodeId={nodeId}
                            graphNode={graphNodes![nodeId]}
                        />
                    ))}
                </div>
                <Menu/>
            </div>
        </graphContext.Provider>
    );
}
