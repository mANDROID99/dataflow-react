import { PortDragTarget } from "../graphEditorTypes";

export function isPortConnectable(from: PortDragTarget, to: PortDragTarget): boolean {
    return (
        from.nodeId !== to.nodeId &&
        from.portId !== to.portId &&
        from.portOut !== to.portOut &&
        from.portSpec.type === to.portSpec.type
    );
}

export function comparePortTargets(a: PortDragTarget | undefined, b: PortDragTarget): boolean {
    if (a == null) {
        return false;
    }

    return (
        a.nodeId === b.nodeId &&
        a.portId === b.portId &&
        a.portOut === b.portOut
    );
}
