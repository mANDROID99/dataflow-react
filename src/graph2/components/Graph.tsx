import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GraphSpec } from '../types/graphSpecTypes';
import { GraphActions, GraphContext } from '../types/graphEditorTypes';
import GraphNodeComponent from './GraphNode';
import { StoreState } from '../../store/storeTypes';
import { removeNode, setNodePosition, setNodeFieldValue, clearPortConnections, addPortConnection } from '../../store/graphActions';
import { ConnectionsManager } from './ConnectionsManager';

type Props = {
    graphId: string;
    spec: GraphSpec;
}

export const graphContext = React.createContext<GraphContext>(null as any);

export default function GraphComponent(props: Props): React.ReactElement {
    const { graphId, spec } = props;

    const graph = useSelector((state: StoreState) => state.graph.graphs[graphId]);

    const dispatch = useDispatch();
    const actions = useMemo((): GraphActions => {
        return {
            removeNode(node: string): void {
                dispatch(removeNode(graphId, node));
            },

            setNodePosition(node: string, x: number, y: number): void {
                dispatch(setNodePosition(graphId, node, x, y));
            },

            setNodeFieldValue(node: string, field: string, value: unknown): void {
                dispatch(setNodeFieldValue(graphId, node, field, value));
            },

            clearPortConnections(node: string, port: string, portOut: boolean): void {
                dispatch(clearPortConnections(graphId, node, port, portOut));
            },

            addPortConnection(node: string, port: string, portOut: boolean, targetNode: string, targetPort: string): void {
                dispatch(addPortConnection(graphId, node, port, portOut, targetNode, targetPort));
            }
        };
    }, [graphId, dispatch]);

    const connsSvgRef = useRef<SVGSVGElement>(null);
    const [connections, setConnections] = useState<ConnectionsManager>();

    const context = useMemo((): GraphContext => {
        return {
            actions,
            spec,
            connections
        };
    }, [spec, actions, connections]);

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
                    {Object.keys(graph.nodes).map(nodeId => (
                        <GraphNodeComponent
                            key={nodeId}
                            nodeId={nodeId}
                            graphNode={graph.nodes[nodeId]}
                        />
                    ))}
                </div>
            </div>
        </graphContext.Provider>
    );
}
