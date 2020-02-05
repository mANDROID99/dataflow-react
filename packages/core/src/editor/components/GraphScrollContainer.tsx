import React, { useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';

import { useDrag } from '../../utils/hooks/useDrag';
import { StoreState } from '../../types/storeTypes';
import { selectScrollX, selectScrollY } from '../../store/selectors';
import { updateScroll, clearSelectedNode, addNode } from '../../store/actions';
import { createGraphNode } from '../../utils/graph/graphNodeFactory';
import { useGraphContext } from '../graphEditorContext';

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
    const { graphConfig } = useGraphContext();

    // select the current scroll state from the store
    const { scrollX, scrollY } = useSelector((state: StoreState) => ({
        scrollX: selectScrollX(state),
        scrollY: selectScrollY(state)
    }), shallowEqual);

    const ref = useRef<HTMLDivElement | null>(null);
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

            // set the new scroll position directly on the element, to
            // avoid spamming the store with actions.
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
        dispatch(clearSelectedNode());
        if (event.button === 0) {
            drag(event.nativeEvent);
        }
    };

    const [, dropRef] = useDrop({
        accept: 'node',
        drop(item: { id: string; type: string }, monitor) {
            const container = scrollRef.current!;
            const offset = monitor.getClientOffset();
            if (!offset || !container) return;

            const bounds = container.getBoundingClientRect();
            const x = offset.x - bounds.left;
            const y = offset.y - bounds.top;

            const graphNode = createGraphNode(x, y, item.id, graphConfig);
            dispatch(addNode(graphNode));
        }
    });

    return (
        <div ref={(el) => {
            ref.current = el;
            dropRef(el);
        }}
            onMouseDown={handleBeginDrag}
            className={classNames("ngraph-wrap-scroller")}
        >
            <div ref={scrollRef} id="ngraph-scroller" style={{
                left: scrollX,
                top: scrollY
            }}>
                {props.children}
            </div>
        </div>
    );
}

export default GraphScrollContainer;
