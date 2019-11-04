import * as SVG from 'svg.js';

type DraggableCallbacks = {
    onStart?(): void;

    onDrag?(dx: number, dy: number): void;

    onEnd?(dx: number, dy: number): void;
}

type DragState = { dx: number, dy: number };

export function makeDraggable(shape: SVG.Element, callbacks: DraggableCallbacks) {
    let drag: DragState | undefined;

    function handleDragStart(event: MouseEvent) {
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

    function handleDragged(event: MouseEvent) {
        if (!drag) return;
        drag.dx += event.movementX;
        drag.dy += event.movementY;

        if (callbacks.onDrag) {
            callbacks.onDrag(drag.dx, drag.dy);
        }
    }

    function handleDragEnd() {
        if (!drag) return;

        if (callbacks.onEnd) {
            callbacks.onEnd(drag.dx, drag.dy);
        }

        drag = undefined;
        window.removeEventListener('mousemove', handleDragged);
        window.removeEventListener('mouseup', handleDragEnd);
    }

    shape.on('mousedown', handleDragStart);

    return () => {
        // cleanup

        shape.off('mousedown', handleDragStart);
        window.removeEventListener('mousemove', handleDragged);
        window.removeEventListener('mouseup', handleDragEnd);
    };
}


