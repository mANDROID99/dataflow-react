import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GraphSpec } from '../types/graphSpecTypes';
import { GraphContext } from '../types/graphEditorTypes';
import GraphNodeComponent from './GraphNode';
import { selectGraphNodes } from '../selectors';
import GraphSVG from './GraphSVG';
import Menu from './menu/Menu';

type Props = {
    graphId: string;
    spec: GraphSpec;
}

export const graphContext = React.createContext<GraphContext>(null as any);


function createModalRootDiv(): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'modal-root';
    return el;
}

export default function GraphComponent(props: Props): React.ReactElement {
    const { graphId, spec } = props;

    const graphNodes = useSelector(selectGraphNodes(graphId));

    const [modalRoot] = useState(createModalRootDiv);
    const graphContainerRef = useRef<HTMLDivElement>(null);

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
            spec,
            modalRoot
        };
    }, [graphId, spec, modalRoot]);

    return (
        <graphContext.Provider value={context}>
            <div ref={graphContainerRef} className="graph">
                <div className="graph-scroll">
                    <GraphSVG graphId={graphId}/>
                    <div className="graph-nodes">
                        {(graphNodes ? Object.keys(graphNodes) : []).map(nodeId => (
                            <GraphNodeComponent
                                key={nodeId}
                                nodeId={nodeId}
                                graphNode={graphNodes![nodeId]}
                            />
                        ))}
                    </div>
                </div>
                <Menu/>
            </div>
        </graphContext.Provider>
    );
}
