import { useState, useCallback, useEffect, useRef } from "react";

type DragState<P> = {
    param: P;
    startX: number;
    startY: number;
    dx: number;
    dy: number;
}

type Opts<P> = {
    onDragStart?: (param: P) => void;
    onDrag?: (dx: number, dy: number, param: P) => void;
    onDragEnd?: (dx: number, dy: number, param: P) => void;
}

export function useDragBehaviour<P>(opts?: Opts<P>): [DragState<P> | null, (event: MouseEvent | React.MouseEvent, param: P) => void] {
    const [dragState, setDragState] = useState<DragState<P> | null>(null);
    const optsRef = useRef(opts);

    let startX: number | null = null;
    let startY: number | null = null;
    let param: P | null = null;

    if (dragState) {
        startX = dragState.startX;
        startY = dragState.startY;
        param = dragState.param;
    }

    useEffect(() => {
        optsRef.current = opts;
    });

    useEffect(() => {
        if (startX == null || startY == null || param == null) {
            return;
        }

        const sx = startX;
        const sy = startY;
        const p = param;

        const handleMouseMove = (event: MouseEvent) => {
            const dx = event.clientX - sx;
            const dy = event.clientY - sy;

            if (optsRef.current && optsRef.current.onDrag) {
                optsRef.current.onDrag(dx, dy, p);
            }
            
            setDragState({ startX: sx, startY: sy, param: p, dx, dy });
        };

        const handleMouseUp = (event: MouseEvent) => {
            const dx = event.clientX - sx;
            const dy = event.clientY - sy;

            if (optsRef.current && optsRef.current.onDragEnd) {
                optsRef.current.onDragEnd(dx, dy, p);
            }

            setDragState(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [startX, startY, param]);

    const handleDragBegin = useCallback((event: MouseEvent | React.MouseEvent, param: P) => {
        if (optsRef.current && optsRef.current.onDragStart) {
            optsRef.current.onDragStart(param);
        }

        setDragState({
            param,
            startX: event.clientX,
            startY: event.clientY,
            dx: 0,
            dy: 0
        });
    }, []);

    return [dragState, handleDragBegin];
}
