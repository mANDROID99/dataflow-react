import React from 'react';
import { GraphNodeComponentProps, DragType } from "../../types/graphNodeComponentTypes";


export default function GraphNodeLabelComponent({ node, handleDrag }: GraphNodeComponentProps<any, any>) {
    const handleDragPos = (event: React.MouseEvent) => {
        handleDrag(event, DragType.DRAG_POS);
    };

    return (
        <div className="ngraph-custom-node" onMouseDown={handleDragPos}>
            <div className="ngraph-custom-node-label">{node.name}</div>
        </div>
    );
}
