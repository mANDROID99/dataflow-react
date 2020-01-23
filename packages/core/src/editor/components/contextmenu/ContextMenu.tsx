import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContextMenuTargetType } from '../../../types/storeTypes';

import Overlay from '../../../common/Overlay';
import ContextMenuCreate from './ContextMenuCreate';
import ContextMenuEdit from './ContextMenuEdit';
import { hideContextMenu } from '../../../store/actions';
import { selectContextMenu } from '../../../store/selectors';

function ContextMenu() {
    const dispatch = useDispatch();
    const contextMenu = useSelector(selectContextMenu);

    if (!contextMenu) {
        return null;
    }

    const target = contextMenu.target;
    const x = contextMenu.x;
    const y = contextMenu.y;

    const handleHide = () => {
        dispatch(hideContextMenu());
    };

    function renderContent() {
        if (target) {
            if (target.type === ContextMenuTargetType.GRAPH_NODE) {
                return <ContextMenuEdit nodeId={target.nodeId}/>;
            }
        }
        return <ContextMenuCreate x={x} y={y}/>;
    }

    return (
        <Overlay onHide={handleHide}>
            <div className="ngraph-contextmenu" style={{ left: x, top: y }}>
                {renderContent()}
            </div>
        </Overlay>
    );
}

export default React.memo(ContextMenu);
