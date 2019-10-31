import React from 'react';
// import React, { useMemo, useReducer } from 'react';

import { Graph as GraphT } from '../types/graphTypes';
import { GraphSpec } from '../types/graphSpecTypes';
import { GraphActions } from '../graphContext';
// import { GraphContext, GraphActions, Context } from '../graphContext';

// import { reducer, init } from '../graphStateReducer';
// import GraphNodeComponent from './GraphNode';
// import GraphSVG from './GraphSVG';
import Graphd3 from './Graphd3';

type Props = {
    spec: GraphSpec;
    graph: GraphT;
    actions: GraphActions;
}

export default function Graph(props: Props) {
    const { graph, spec, actions } = props;
    // const [state, dispatch] = useReducer(reducer, null, init);

    // const graphContext = useMemo<GraphContext>(() => {
    //     return {
    //         spec,
    //         actions,
    //         dispatch
    //     };
    // }, [spec, actions]);

    // const graphNodes = graph.nodes;
    // const nodeDrag = state.nodeDrag;

    return (
        <Graphd3 graph={graph} spec={spec} actions={actions}/>
        // <Context.Provider value={graphContext}>
        //     <div className="graph-container">
        //         <div className="graph-nodes">
        //             {Object.entries(graphNodes).map(([nodeId, node]) => {
        //                 const isDragging = nodeDrag ? nodeDrag.nodeId === nodeId : false;
        //                 const dragX = isDragging ? nodeDrag!.dx : undefined;
        //                 const dragY = isDragging ? nodeDrag!.dy : undefined;

        //                 return (
        //                     <GraphNodeComponent
        //                         key={nodeId}
        //                         nodeId={nodeId}
        //                         node={node}
        //                         isDragging={isDragging}
        //                         dragX={dragX}
        //                         dragY={dragY}
        //                         portDrag={state.portDrag}
        //                     />
        //                 );
        //             })}
        //         </div>
        //         <GraphSVG graph={graph} state={state}/>
        //     </div>
        // </Context.Provider>
    );
}
