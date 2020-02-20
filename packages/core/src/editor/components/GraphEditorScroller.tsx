import React, { useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';

import { useDrag } from '../../utils/hooks/useDrag';
import { clearSelectedNode, addNode } from '../../store/actions';
import { createGraphNode } from '../../utils/graph/graphNodeFactory';
import { useGraphContext } from '../graphEditorContext';
import { containerContext, GraphContainerContext } from '../graphContainerContext';
import { GraphNodePortRefs } from '../GraphNodePortRefs';

type Props = {
    parent?: string;
    children: (scrollX: number, scrollY: number) => React.ReactNode | null;
}

type DragState = {
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
}

type ScrollState = {
    x: number;
    y: number;
};

function GraphEditorScroller({ parent, children }: Props) {
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext();
    const ref = useRef<HTMLDivElement | null>(null);
    const [scroll, setScroll] = useState<ScrollState>({ x: 0, y: 0 });
    const [scrolling, setScrolling] = useState(false);

    useDrag<DragState>(ref, {
        checkTarget: true,
        onStart(event) {
            const startMouseX = event.clientX;
            const startMouseY = event.clientY;
            setScrolling(true);

            return {
                startMouseX,
                startMouseY,
                startX: scroll.x,
                startY: scroll.y
            };
        },
        onDrag(event, state) {
            const x = state.startX + event.clientX - state.startMouseX;
            const y = state.startY + event.clientY - state.startMouseY;
            setScroll({ x, y });
        },
        onEnd() {
            setScrolling(false);
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
            dispatch(addNode(graphNode, parent));
        }
    });

    // construct the container context
    const context = useMemo((): GraphContainerContext => {
        return {
            ports: new GraphNodePortRefs(),
            container: ref,
            parentNodeId: parent
        };
    }, [parent]);

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
            <containerContext.Provider value={context}>
                {children(scroll.x, scroll.y)}
            </containerContext.Provider>
        </div>
    );
}

export default GraphEditorScroller;
