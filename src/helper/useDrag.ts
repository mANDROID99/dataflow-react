import { useState, useEffect, useRef } from "react";
import { batch } from "react-redux";

type DragOptions<T> = {
    onStart: (event: MouseEvent) => T;
    onDrag?: (event: MouseEvent, value: T) => void;
    onEnd?: (value: T) => void;
}

export function useDrag<T>(ref: React.RefObject<HTMLElement>, opts: DragOptions<T>): void {
    const [drag, setDrag] = useState<[T]>();

    const optsRef = useRef(opts);
    optsRef.current = opts;

    useEffect(() => {
        if (drag === undefined) {
            return;
        }

        function onDrag(event: MouseEvent): void {
            optsRef.current.onDrag?.(event, drag![0]);
        }

        function onDragEnd(): void {
            optsRef.current?.onEnd?.(drag![0]);
            setDrag(undefined);
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);

        return (): void => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
        };
    }, [drag]);

    useEffect(() => {
        const el = ref.current;
        if (el == null) return;

        const startDrag = (event: MouseEvent): void => {
            if (event.button === 0 && el === event.target) {
                event.stopPropagation();
                const drag = optsRef.current.onStart(event);
                setDrag([drag]);
            }
        };

        el.addEventListener('mousedown', startDrag);
        return (): void => {
            el.removeEventListener('mousedown', startDrag);
        };
    }, [ref]);
}
