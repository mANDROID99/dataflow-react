import { PortDragTarget } from "../types/graphEditorTypes";

export enum EventType {
    ACTIVE_PORT_CHANGED,
    TARGET_PORT_CHANGED
}

export type TargetPortChangedEvent = {
    type: EventType.TARGET_PORT_CHANGED;
    port: PortDragTarget | undefined;
}

export type ActivePortChangedEvent = {
    type: EventType.ACTIVE_PORT_CHANGED;
    port: PortDragTarget | undefined;
}

export type GraphEditorEvent = TargetPortChangedEvent | ActivePortChangedEvent;

export type GraphEditorListener = (event: GraphEditorEvent) => void;

export class GraphEditorEvents {
    private readonly listeners: GraphEditorListener[] = [];

    addListener(listener: GraphEditorListener): GraphEditorListener {
        this.listeners.push(listener);
        return listener;
    }

    removeListener(listener: GraphEditorListener): boolean {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
            return true;
        }
        return false;
    }

    trigger(event: GraphEditorEvent): void {
        this.listeners.forEach((handler): void => handler(event));
    }
}
