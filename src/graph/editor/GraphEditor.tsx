import React, { useReducer, useEffect, useMemo } from "react";
import styles from './GraphEditor.module.scss';

import { GraphConfig } from "../types/graphConfigTypes";
import { Graph } from "../types/graphTypes";
import { GraphActionType, GraphAction } from "../types/graphStateTypes";
import { reducer, init } from "./graphReducer";
import GraphNode from "./GraphNode";

type Props<Ctx> = {
    graph: Graph;
    graphConfig: GraphConfig<Ctx>;
    onChanged: (graph: Graph) => void;
}

export type Context<Ctx> = {
    graphConfig: GraphConfig<Ctx>;
    dispatch: React.Dispatch<GraphAction>;
}

export const graphContext = React.createContext<Context<any>>(null as any);

export default function GraphEditor<Ctx>(props: Props<Ctx>) {
    const graphConfig = props.graphConfig;
    const [state, dispatch] = useReducer(reducer, props.graph, init);

    // reset the state when the props changed
    useEffect(() => {
        if (state.initialGraph !== props.graph) {
            dispatch({ type: GraphActionType.INIT, graph: props.graph });
        }
    }, [state.initialGraph, props.graph]);

    // notify the parent component when the graph changed
    useEffect(() => {
        if (state.graph !== state.initialGraph) {
            props.onChanged(state.graph);
        }
    }, [state.graph, props.onChanged]);

    // construct the context object
    const contextValue: Context<Ctx> = useMemo((): Context<Ctx> => {
        return {
            graphConfig,
            dispatch
        }
    }, [graphConfig, dispatch]);

    const nodes = state.graph.nodes;

    return (
        <graphContext.Provider value={contextValue}>
            <svg className={styles.editor}>
                {Object.keys(nodes).map((nodeId) => {
                    const node = nodes[nodeId];
                    return (
                        <GraphNode
                            key={nodeId}
                            nodeId={nodeId}
                            graphNode={node}
                            drag={state.nodeDrag}
                        />
                    );
                })}
            </svg>
        </graphContext.Provider>
    );
}
