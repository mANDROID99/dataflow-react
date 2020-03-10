import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import GraphConnectionsContainer from '../../editor/components/connections/GraphConnectionsContainer';
import GraphNodes from '../../editor/components/GraphNodes';
import GraphScroller from '../../editor/components/GraphScroller';
import { DragType, GraphNodeComponentProps } from '../../types/graphNodeComponentTypes';

export default function SubGraphNodeComponent({ node, nodeId, nodeConfig, handleDrag, actions, width, height }: GraphNodeComponentProps<any, any>) {

    const handleToggleCollaped = () => {
        actions.setCollapsed(!node.collapsed);
    };

    const handleDragPos = (event: React.MouseEvent) => {
        handleDrag(event, DragType.DRAG_POS);
    };

    const handleDragSize = (event: React.MouseEvent) => {
        handleDrag(event, DragType.DRAG_SIZE);
    };

    return (
        <div className="ngraph-node-body">
            <div className="ngraph-node-header" onMouseDown={handleDragPos}>
                <div className="ngraph-node-header-icon" onClick={handleToggleCollaped}>
                    <FontAwesomeIcon icon={node.collapsed ? "folder" : "folder-open"}/>
                </div>
                <div className="ngraph-node-title ngraph-text-ellipsis">
                    {node.name ?? nodeConfig.title}
                </div>
            </div>
            {!node.collapsed && (
                <div className="ngraph-subgraph-container" style={{ width, height }}>
                    <svg className="ngraph-subgraph-resizer" width="10px" height="10px" onMouseDown={handleDragSize}>
                        <path d="M10 0L10 10L0 10"/>
                    </svg>
                    <GraphScroller parent={nodeId}>
                        {(scrollX, scrollY) => (
                            <>
                                <GraphConnectionsContainer
                                    scrollX={scrollX}
                                    scrollY={scrollY}
                                    parent={nodeId}
                                />
                                <GraphNodes
                                    scrollX={scrollX}
                                    scrollY={scrollY}
                                    parent={nodeId}
                                />
                            </>
                        )}
                    </GraphScroller>
                </div>
            )}
        </div>
    );
}
