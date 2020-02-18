import { useState, useCallback, useEffect, useRef } from "react";

type DragState = {
    startX: number;
    startY: number;
    dx: number;
    dy: number;
}

type Opts = {
    onDragStart?: (event: MouseEvent) => void;
    onDrag?: (dx: number, dy: number, event: MouseEvent) => void;
    onDragEnd?: (dx: number, dy: number, event: MouseEvent) => void;
}

export function useDragBehaviour(opts?: Opts): [DragState | null, (event: MouseEvent | React.MouseEvent) => void] {
    const [dragState, setDragState] = useState<DragState | null>(null);
    const optsRef = useRef(opts);

    let startX: number | null = null;
    let startY: number | null = null;

    if (dragState) {
        startX = dragState.startX;
        startY = dragState.startY;
    }

    useEffect(() => {
        optsRef.current = opts;
    });

    useEffect(() => {
        if (startX == null || startY == null) {
            return;
        }

        const sx = startX;
        const sy = startY;

        const handleMouseMove = (event: MouseEvent) => {
            const dx = event.clientX - sx;
            const dy = event.clientY - sy;

            if (optsRef.current && optsRef.current.onDrag) {
                optsRef.current.onDrag(dx, dy, event);
            }
            
            setDragState({ startX: sx, startY: sy, dx, dy });
        };

        const handleMouseUp = (event: MouseEvent) => {
            const dx = event.clientX - sx;
            const dy = event.clientY - sy;

            if (optsRef.current && optsRef.current.onDragEnd) {
                optsRef.current.onDragEnd(dx, dy, event);
            }

            setDragState(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [startX, startY]);

    const handleDragBegin = useCallback((event: MouseEvent | React.MouseEvent) => {
        if (optsRef.current && optsRef.current.onDragStart) {
            optsRef.current.onDragStart(event as MouseEvent);
        }

        setDragState({
            startX: event.clientX,
            startY: event.clientY,
            dx: 0,
            dy: 0
        });
    }, []);

    return [dragState, handleDragBegin];
}
