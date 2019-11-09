import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GraphSpec } from '../types/graphSpecTypes';
import { GraphContext } from '../types/graphEditorTypes';
import GraphNodeComponent from './GraphNode';
import { ConnectionsManager } from './ConnectionsManager';
import { selectGraph } from '../selectors';

type Props = {
    graphId: string;
    spec: GraphSpec;
}

export const graphContext = React.createContext<GraphContext>(null as any);

export default function GraphComponent(props: Props): React.ReactElement {
    const { graphId, spec } = props;

    const graph = useSelector(selectGraph(graphId));
    const connsSvgRef = useRef<SVGSVGElement>(null);
    const [connections, setConnections] = useState<ConnectionsManager>();

    const context = useMemo((): GraphContext => {
        return {
            graphId,
            spec,
            connections
        };
    }, [graphId, spec, connections]);

    useEffect(() => {
        const svg = connsSvgRef.current;
        if (svg != null) {
            setConnections(new ConnectionsManager(svg));
        }
    }, []);

    return (
        <graphContext.Provider value={context}>
            <div className="graph">
                <svg className="graph-connections" ref={connsSvgRef}/>
                <div className="graph-nodes">
                    {(graph ? Object.keys(graph.nodes) : []).map(nodeId => (
                        <GraphNodeComponent
                            key={nodeId}
                            nodeId={nodeId}
                            graphNode={graph!.nodes[nodeId]}
                        />
                    ))}
                </div>
            </div>
        </graphContext.Provider>
    );
}
