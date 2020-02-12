import { useState, useEffect, useRef, useCallback } from "react";

type DragOptions<T> = {
    onStart: (event: MouseEvent) => T;
    onDrag?: (event: MouseEvent, state: T) => void;
    onEnd?: (event: MouseEvent, state: T) => void;
}

export function useDrag<T>(opts: DragOptions<T>): (event: MouseEvent) => void {
    const [drag, setDrag] = useState<T | null>(null);

    const optsRef = useRef(opts);
    optsRef.current = opts;

    useEffect(() => {
        if (drag === null) {
            return;
        }

        let isDragged = false;

        function onDrag(event: MouseEvent): void {
            isDragged = true;
            optsRef.current.onDrag?.(event, drag!);
        }

        function onDragEnd(event: MouseEvent): void {
            if (event.button === 0) {
                if (isDragged) {
                    optsRef.current.onEnd?.(event, drag!);
                }
                setDrag(null);
            }
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);

        return (): void => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
        };
    }, [drag]);

    return useCallback((event: MouseEvent): void => {
        const drag = optsRef.current.onStart(event);

        if (drag === null) {
            throw new Error('Drag state cannot be null!');
        }

        setDrag(drag);
    }, []);
}
