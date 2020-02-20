import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeComponentProps, DragType } from "../../types/graphConfigTypes";
import GraphEditorScroller from '../../editor/components/GraphEditorScroller';

export default function SubGraphNodeComponent({ node, nodeConfig, handleDrag, actions, width, height }: GraphNodeComponentProps<any, any>) {

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
                    {/* <GraphEditorScroller>
                        {(scrollX, scrollY) => (
                            <GraphEditorNodes
                                scrollX={scrollX}
                                scrollY={scrollY}
                                graphConfig={}
                            />
                        )}
                    </GraphEditorScroller> */}
                </div>
            )}
        </div>
    );
}
