import { useEffect, useRef } from "react";

type DragOptions<T> = {
    checkTarget?: boolean;
    onStart: (event: MouseEvent) => T;
    onDrag?: (event: MouseEvent, state: T) => void;
    onEnd?: (event: MouseEvent, state: T) => void;
}

export function useDrag<T>(ref: React.RefObject<HTMLElement>, opts: DragOptions<T>): void {
    const optsRef = useRef(opts);
    optsRef.current = opts;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let state: T;

        const onDrag = (event: MouseEvent) => {
            optsRef.current.onDrag?.(event, state);
        };

        const onDragEnd = (event: MouseEvent) => {
            optsRef.current.onEnd?.(event, state);
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onDragEnd);
        };

        const onDragStart = (event: MouseEvent) => {
            // check the event target matches the ref
            if (optsRef.current.checkTarget && event.target !== ref.current) {
                return;
            }
            
            event.stopPropagation();
            state = optsRef.current.onStart(event);
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', onDragEnd);
        };

        el.addEventListener('mousedown', onDragStart);

        return () => {
            el.removeEventListener('mousedown', onDragStart);
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onDragEnd);
        };
    }, [ref]);
}
