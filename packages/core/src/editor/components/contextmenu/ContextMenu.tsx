import React from 'react';
import { useGraphContext } from '../../graphEditorContext';
import Overlay from '../../../common/Overlay';
import { GraphActionType, ContextMenuState, ContextMenuTargetType } from '../../../types/graphReducerTypes';
import ContextMenuCreate from './ContextMenuCreate';
import ContextMenuEdit from './ContextMenuEdit';

type Props = {
    contextMenu: ContextMenuState;
}

function ContextMenu(props: Props) {
    const contextMenu = props.contextMenu;
    const target = contextMenu.target;
    const x = contextMenu.x;
    const y = contextMenu.y;
    const { dispatch } = useGraphContext();

    const handleHide = () => {
        dispatch({
            type: GraphActionType.HIDE_CONTEXT_MENU
        });
    };

    function renderContent() {
        if (target) {
            if (target.type === ContextMenuTargetType.GRAPH_NODE) {
                return <ContextMenuEdit nodeId={target.nodeId} dispatch={dispatch}/>;
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
