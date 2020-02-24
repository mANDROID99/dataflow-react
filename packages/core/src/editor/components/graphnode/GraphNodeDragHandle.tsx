import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import { DragType } from '../../../types/graphNodeComponentTypes';

type Props = {
    nodeWidth: number;
    nodeConfig: GraphNodeConfig<any, any>;
    onDrag: (event: React.MouseEvent, type: DragType) => void;
}

function GraphNodeDragHandle({ onDrag }: Props) {

    const handleDragWidth = (e: React.MouseEvent) => {
        onDrag(e, DragType.DRAG_WIDTH);
    };

    return (
        <div onMouseDown={handleDragWidth} className="ngraph-node-header-icon ngraph-node-drag-handle">
            <FontAwesomeIcon icon="arrows-alt-h"/>
        </div>
    );
}

export default React.memo(GraphNodeDragHandle);
