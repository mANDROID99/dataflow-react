import React, { useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { useDrag } from '../../utils/hooks/useDrag';
import { StoreState } from '../../types/storeTypes';
import { selectScrollX, selectScrollY } from '../../store/selectors';
import { updateScroll, clearSelectedNode, showContextMenu } from '../../store/actions';

type Props = {
    children: React.ReactChild;
}

type DragState = {
    scrollX: number;
    scrollY: number;
    startX: number;
    startY: number;
}

function GraphScrollContainer(props: Props) {
    const dispatch = useDispatch();
    const { scrollX, scrollY } = useSelector((state: StoreState) => ({
        scrollX: selectScrollX(state),
        scrollY: selectScrollY(state)
    }), shallowEqual);

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

            const scrollX = state.scrollX + dx;
            const scrollY = state.scrollY + dy; 

            dispatch(updateScroll(scrollX, scrollY));
        }
    });
      
    const handleBeginDrag = (event: React.MouseEvent) => {
        if (event.button === 0) {
            drag(event.nativeEvent);
        }
    };

    const handleClearSelected = () => {
        dispatch(clearSelectedNode());
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        const bounds = ref.current!.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        dispatch(showContextMenu(undefined, x, y));
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

export default React.memo(GraphScrollContainer);
