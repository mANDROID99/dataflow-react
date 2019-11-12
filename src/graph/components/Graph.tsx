import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu';

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

export default function GraphComponent(props: Props): React.ReactElement {
    const { graphId, spec } = props;

    const graphNodes = useSelector(selectGraphNodes(graphId));
    const context = useMemo((): GraphContext => {
        return {
            graphId,
            spec
        };
    }, [graphId, spec]);

    return (
        <graphContext.Provider value={context}>
            <div className="graph">
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
                <Menu/>
            </div>
        </graphContext.Provider>
    );
}
