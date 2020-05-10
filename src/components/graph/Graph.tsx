import React from 'react';
import { useSelector } from "react-redux";
import { selectGraphNodeIds } from "../../redux/editorSelectors";
import GraphNode from './GraphNode';
import GraphConnections from '../connection/GraphConnections';

function Graph() {
    const nodeIds = useSelector(selectGraphNodeIds);
    return (
        <svg className="ngraph-designer-svg">
            <GraphConnections/>
            {nodeIds.map((nodeId) => (
                <GraphNode key={nodeId} nodeId={nodeId}/>
            ))}
        </svg>
    );
}

export default React.memo(Graph);
