import React, { useRef, useState } from 'react';
import { useDispatch, batch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';

import { useDrag } from '../../utils/hooks/useDrag';
import { selectScrollX, selectScrollY } from '../../store/selectors';
import { setScroll, clearSelectedNode, addNode } from '../../store/actions';
import { createGraphNode } from '../../utils/graph/graphNodeFactory';
import { useGraphContext } from '../graphEditorContext';

type Props = {
    children: (scrollX: number, scrollY: number) => React.ReactNode | null;
}

type DragState = {
    startMouseX: number;
    startMouseY: number;
    startScrollX: number;
    startScrollY: number;
    scrollX: number;
    scrollY: number;
}

type ScrollState = {
    x: number;
    y: number;
};

function GraphEditorScroller(props: Props) {
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext();
    const ref = useRef<HTMLDivElement | null>(null);

    const [scrollState, setScrollState] = useState<ScrollState>();
    const scrollX = useSelector(selectScrollX);
    const scrollY = useSelector(selectScrollY);

    useDrag<DragState>(ref, {
        checkTarget: true,
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
            state.scrollX = state.startScrollX + event.clientX - state.startMouseX;
            state.scrollY = state.startScrollY + event.clientY - state.startMouseY;
            setScrollState({
                x: state.scrollX,
                y: state.scrollY
            });
        },
        onEnd(event, state) {
            if (state.scrollX !== state.startScrollX || state.scrollY !== state.startScrollY) {
                batch(() => {
                    setScrollState(undefined);
                    dispatch(setScroll(state.scrollX, state.scrollY));
                });
            }
        }
    });

    const [, dropRef] = useDrop({
        accept: 'node',
        drop(item: { id: string; type: string }, monitor) {
            const offset = monitor.getClientOffset();
            const el = ref.current;
            if (!offset || !el) return;

            const bounds = el.getBoundingClientRect();
            const x = offset.x - bounds.left - scrollX;
            const y = offset.y - bounds.top - scrollY;

            const graphNode = createGraphNode(x, y, item.id, graphConfig);
            dispatch(addNode(graphNode));
        }
    });

    const handleClick = () => {
        dispatch(clearSelectedNode());
    };

    const scrolling = scrollState != null;
    let sx = scrollX;
    let sy = scrollY;

    if (scrollState) {
        sx = scrollState.x;
        sy = scrollState.y;
    }

    return (
        <div ref={(el) => {
            ref.current = el;
            dropRef(el);
        }}
            className={classNames("ngraph-editor-content", { scrolling })}
            onClick={handleClick}
        >
            {props.children(sx, sy)}
        </div>
    );
}

export default GraphEditorScroller;
