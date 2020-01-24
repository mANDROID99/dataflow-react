import React, { useRef, useState } from 'react';
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
    startMouseX: number;
    startMouseY: number;
    startScrollX: number;
    startScrollY: number;
    scrollX: number;
    scrollY: number;
}

function GraphScrollContainer(props: Props) {
    const dispatch = useDispatch();

    // select the current scroll state from the store
    const { scrollX, scrollY } = useSelector((state: StoreState) => ({
        scrollX: selectScrollX(state),
        scrollY: selectScrollY(state)
    }), shallowEqual);

    const ref = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const drag = useDrag<DragState>({
        onStart(event) {
            const startMouseX = event.clientX;
            const startMouseY = event.clientY;

            return {
                startMouseX,
                startMouseY,
                startScrollX: scrollX,
                startScrollY: scrollY,
                scrollX,
                scrollY
            };
        },
        onDrag(event, state) {
            const dx = event.clientX - state.startMouseX;
            const dy = event.clientY - state.startMouseY;

            state.scrollX = state.startScrollX + dx;
            state.scrollY = state.startScrollY + dy;

            // set the new scroll position directly on the element.
            // Don't update the store to avoid spamming actions.
            const scrollEl = scrollRef.current;
            if (scrollEl) {
                scrollEl.style.left = state.scrollX + 'px';
                scrollEl.style.top = state.scrollY + 'px';
            }

        },
        onEnd(event, state) {
            dispatch(updateScroll(state.scrollX, state.scrollY));
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
            <div ref={scrollRef} className="ngraph-scroller" style={{
                left: scrollX,
                top: scrollY
            }}>
                {props.children}
            </div>
        </div>
    );
}

export default React.memo(GraphScrollContainer);
