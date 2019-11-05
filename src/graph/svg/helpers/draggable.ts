import * as SVG from 'svg.js';

export type DraggableCallbacks = {
    onStart?(): void;

    onDrag?(state: DragState, event: MouseEvent): void;

    onEnd?(state: DragState, event: MouseEvent): void;
}

export type DragState = { dx: number; dy: number };

export function makeDraggable(shape: SVG.Element, callbacks: DraggableCallbacks): () => void {
    let drag: DragState | undefined;

    function handleDragged(event: MouseEvent): void {
        if (!drag) return;
        drag.dx += event.movementX;
        drag.dy += event.movementY;

        if (callbacks.onDrag) {
            callbacks.onDrag(drag, event);
        }
    }

    function handleDragEnd(event: MouseEvent): void {
        if (!drag) return;

        if (callbacks.onEnd) {
            callbacks.onEnd(drag, event);
        }

        drag = undefined;
        window.removeEventListener('mousemove', handleDragged);
        window.removeEventListener('mouseup', handleDragEnd);
    }

    function handleDragStart(event: MouseEvent): void {
        if (event.button !== 0) {
            return;
        }

        drag = { dx: 0, dy: 0 };

        if (callbacks.onStart) {
            callbacks.onStart();
        }

        window.addEventListener('mousemove', handleDragged);
        window.addEventListener('mouseup', handleDragEnd);
    }

    shape.on('mousedown', handleDragStart);

    return (): void => {
        // cleanup

        shape.off('mousedown', handleDragStart);
        window.removeEventListener('mousemove', handleDragged);
        window.removeEventListener('mouseup', handleDragEnd);
    };
}


