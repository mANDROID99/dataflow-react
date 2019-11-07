import { useState, useEffect, useRef, useCallback } from "react"
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
    onEnd?: (dx: number, dy: number) => void;
}

export function useDrag(opts?: DragOptions): [Drag | undefined, (event: React.MouseEvent | MouseEvent) => void] {
    const [dragStart, setDragStart] = useState<DragStart>();
    const [drag, setDrag] = useState<Drag>();

    const optsRef = useRef(opts);
    optsRef.current = opts;

    useEffect(() => {
        if (!dragStart) {
            return;
        }

        const startX = dragStart.startX;
        const startY = dragStart.startY;

        function onDrag(event: MouseEvent): void {
            const dx = event.screenX - startX;
            const dy = event.screenY - startY;
            setDrag({ startX, startY, dx, dy });
        }

        function onDragEnd(event: MouseEvent): void {
            const dx = event.screenX - startX;
            const dy = event.screenY - startY;
            batch(() => {
                optsRef.current?.onEnd?.(dx, dy);
                setDrag(undefined);
                setDragStart(undefined);
            });
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
            setDragStart({ startX: event.screenX, startY: event.screenY });
        }
    }, []);

    return [drag, startDrag];
}
