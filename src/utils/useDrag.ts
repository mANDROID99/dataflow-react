import { useRef, RefObject, useEffect } from 'react';

type Opts<T> = {
    onStart: (e: MouseEvent) => T;
    onDrag?: (e: MouseEvent, ctx: T) => void;
    onEnd?: (e: MouseEvent, ctx: T) => void;
    onClick?: (e: MouseEvent, ctx: T) => void;
}

export function useDrag<T>(ref: RefObject<HTMLElement | SVGElement>, opts: Opts<T>) {
    const optsRef = useRef(opts);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let ctx!: T;

        const handleDrag = (e: MouseEvent) => {
            optsRef.current.onDrag?.(e, ctx);
        }

        const handleDragEnd = (e: MouseEvent) => {
            optsRef.current.onEnd?.(e, ctx);
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        }

        const handleDragStart = (e: MouseEvent) => {
            ctx = optsRef.current.onStart(e);
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
        }

        el.addEventListener('mousedown', handleDragStart as any);
        
        return () => {
            el.removeEventListener('mousedown', handleDragStart as any);
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };
    }, [ref]);

    useEffect(() => {
        optsRef.current = opts;
    });
}
