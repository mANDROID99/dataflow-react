import React, { useRef } from 'react';
import classNames from 'classnames';
import { GraphAction, GraphActionType } from "../../types/graphReducerTypes";
import { useDrag } from '../../utils/hooks/useDrag';

type Props = {
    dispatch: React.Dispatch<GraphAction>;
    children: React.ReactChild;
    scrollX: number;
    scrollY: number;
}

type DragState = {
    scrollX: number;
    scrollY: number;
    startX: number;
    startY: number;
}

function GraphScroller(props: Props) {
    const dispatch = props.dispatch;
    const scrollX = props.scrollX;
    const scrollY = props.scrollY;

    const ref = useRef<HTMLDivElement>(null);

    const drag = useDrag<DragState>({
        onStart(event) {
            const startX = event.clientX;
            const startY = event.clientY;
            return { startX, startY, scrollX, scrollY };
        },
        onDrag(event, state) {
            const dx = event.clientX - state.startX;
            const dy = event.clientY - state.startY;

            dispatch({
                type: GraphActionType.UPDATE_SCROLL,
                scrollX: state.scrollX + dx,
                scrollY: state.scrollY + dy
            });
        }
    });
      
    const handleBeginDrag = (event: React.MouseEvent) => {
        if (event.button === 0) {
            drag(event.nativeEvent);
        }
    };

    const handleClearSelected = () => {
        dispatch({ type: GraphActionType.CLEAR_SELECTED_NODE });
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        const bounds = ref.current!.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        dispatch({ type: GraphActionType.SHOW_CONTEXT_MENU, x, y, target: undefined });
    };
    
    return (
        <div ref={ref}
            onClick={handleClearSelected}
            onMouseDown={handleBeginDrag}
            onContextMenu={handleContextMenu}
            className={classNames("ngraph-wrap-scroller")}
        >
            <div className="ngraph-scroller" style={{
                left: scrollX,
                top: scrollY
            }}>
                {props.children}
            </div>
        </div>
    );
}

export default GraphScroller;
