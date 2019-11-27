import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GraphConfig } from '../../types/graphConfigTypes';
import GraphNodeComponent from './GraphNode';
import { selectGraphNodes } from '../selectors';
import GraphSVG from './GraphSVG';
import Menu from './menu/Menu';

type Props = {
    graphId: string;
    graphSpec: GraphConfig;
    context?: unknown;
}

export type GraphContext = {
    graphId: string;
    graphSpec: GraphConfig;
    modalRoot: Element;
    ctx: unknown;
}

export const graphContext = React.createContext<GraphContext>(null as any);

function createModalRootDiv(): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'modal-root';
    return el;
}

export default function GraphEditor({ graphId, graphSpec: spec, context: ctx }: Props) {
    const [scroll, setScroll] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [modalRoot] = useState(createModalRootDiv);
    const graphContainerRef = useRef<HTMLDivElement>(null);

    const graphNodes = useSelector(selectGraphNodes(graphId));

    useEffect(() => {
        const container = graphContainerRef.current;
        if (!container) return;
        container.appendChild(modalRoot);
        return (): void => {
            container.removeChild(modalRoot);
        };
    }, [modalRoot]);

    const context = useMemo((): GraphContext => {
        return {
            graphId,
            graphSpec: spec,
            modalRoot,
            ctx
        };
    }, [graphId, spec, modalRoot, ctx]);

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
