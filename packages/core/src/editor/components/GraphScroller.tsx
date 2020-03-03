import React, { useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';

import { useDrag } from '../../utils/hooks/useDrag';
import { clearSelectedNode, addNode, showContextMenu } from '../../store/actions';
import { graphNodeFactory } from '../../utils/graph/graphNodeFactory';
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

function GraphScroller({ parent, children }: Props) {
    const dispatch = useDispatch();
    const { graphConfig, params } = useGraphContext();
    const container = useRef<HTMLDivElement | null>(null);
    const [scroll, setScroll] = useState<ScrollState>({ x: 0, y: 0 });
    const [scrolling, setScrolling] = useState(false);

    useDrag<DragState>(container, {
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
            if (!offset) return;

            const c = container.current;
            if (!c) return;

            const bounds = c.getBoundingClientRect();
            const x = offset.x - scroll.x - bounds.left;
            const y = offset.y - scroll.y - bounds.top;

            const graphNode = graphNodeFactory(graphConfig, params)(x, y, parent, item.id);
            dispatch(addNode(graphNode));
        }
    });

    // construct the container context
    const context = useMemo((): GraphContainerContext => {
        return {
            ports: new GraphNodePortRefs(),
            parentNodeId: parent
        };
    }, [parent]);

    const handleClick = () => {
        dispatch(clearSelectedNode());
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(showContextMenu(undefined, e.clientX, e.clientY));
    };
    
    return (
        <div ref={(el) => {
            container.current = el;
            dropRef(el);
        }}
            className={classNames("ngraph-editor-scroller", { scrolling })}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
        >
            <containerContext.Provider value={context}>
                {children(scroll.x, scroll.y)}
            </containerContext.Provider>
        </div>
    );
}

export default GraphScroller;
