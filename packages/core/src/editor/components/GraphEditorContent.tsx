import React, { useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';

import { useDrag } from '../../utils/hooks/useDrag';
import { StoreState } from '../../types/storeTypes';
import { selectScrollX, selectScrollY, selectScrolling } from '../../store/selectors';
import { updateScroll, clearSelectedNode, addNode, endScroll } from '../../store/actions';
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
}

function GraphEditorContent(props: Props) {
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext();

    const store = useStore<StoreState>();
    const scrolling = useSelector(selectScrolling);
    const ref = useRef<HTMLDivElement | null>(null);

    useDrag<DragState>(ref, {
        onStart(event) {
            const storeState = store.getState();
            const startMouseX = event.clientX;
            const startMouseY = event.clientY;

            return {
                startMouseX,
                startMouseY,
                startScrollX: selectScrollX(storeState),
                startScrollY: selectScrollY(storeState)
            };
        },
        onDrag(event, state) {
            const scrollX = state.startScrollX + event.clientX - state.startMouseX;
            const scrollY = state.startScrollY + event.clientY - state.startMouseY;
            dispatch(updateScroll(scrollX, scrollY));
        },
        onEnd() {
            dispatch(endScroll());
        }
    });

    const [, dropRef] = useDrop({
        accept: 'node',
        drop(item: { id: string; type: string }, monitor) {
            const offset = monitor.getClientOffset();
            const el = ref.current;
            if (!offset || !el) return;

            const bounds = el.getBoundingClientRect();
            const storeState = store.getState();

            const x = offset.x - bounds.left - selectScrollX(storeState);
            const y = offset.y - bounds.top - selectScrollY(storeState);

            const graphNode = createGraphNode(x, y, item.id, graphConfig);
            dispatch(addNode(graphNode));
        }
    });

    const handleClick = () => {
        dispatch(clearSelectedNode());
    };

    return (
        <div ref={(el) => {
            ref.current = el;
            dropRef(el);
        }}
            className={classNames("ngraph-editor-content", { scrolling })}
            onClick={handleClick}
        >
            {props.children}
        </div>
    );
}

export default GraphEditorContent;
