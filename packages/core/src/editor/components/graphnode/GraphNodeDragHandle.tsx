import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';

type Props = {
    nodeId: string;
    nodeWidth: number;
    nodeConfig: GraphNodeConfig<any, any>;
    onDragWidth: (event: React.MouseEvent) => void;
}

function GraphNodeDragHandle({  onDragWidth }: Props) {
    return (
        <div onMouseDown={onDragWidth} className="ngraph-node-header-icon ngraph-node-drag-handle">
            <FontAwesomeIcon icon="arrows-alt-h"/>
        </div>
    );
}

export default React.memo(GraphNodeDragHandle);
