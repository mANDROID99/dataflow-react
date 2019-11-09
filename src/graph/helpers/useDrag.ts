import { useState, useEffect, useRef, useCallback } from "react";
import { batch } from "react-redux";

type DragStart = {
    startX: number;
    startY: number;
}

type Drag = {
    startX: number;
    startY: number;
    dx: number;
    dy: number;
}

type DragOptions = {
    onStart?: (dragStart: DragStart) => void;
    onEnd?: (drag: Drag) => void;
    onDrag?: (drag: Drag) => void;
}

export function useDrag(opts?: DragOptions): (event: React.MouseEvent | MouseEvent) => void {
    const [dragStart, setDragStart] = useState<DragStart>();

    const optsRef = useRef(opts);
    optsRef.current = opts;

    useEffect(() => {
        if (!dragStart) {
            return;
        }

        const startX = dragStart.startX;
        const startY = dragStart.startY;

        function onDrag(event: MouseEvent): void {
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            optsRef.current?.onDrag?.({ startX, startY, dx, dy });
        }

        function onDragEnd(event: MouseEvent): void {
            if (event.button === 0) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                batch(() => {
                    optsRef.current?.onEnd?.({ startX, startY, dx, dy });
                    setDragStart(undefined);
                });
            }
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);

        return (): void => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
        };
    }, [dragStart]);

    const startDrag = useCallback((event: React.MouseEvent | MouseEvent) => {
        if (event.button === 0) {
            event.stopPropagation();

            const startState: DragStart = {
                startX: event.clientX,
                startY: event.clientY
            };
            
            optsRef.current?.onStart?.(startState);
            setDragStart(startState);
        }
    }, []);

    return startDrag;
}
