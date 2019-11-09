import { PortDrag } from "../../store/storeTypes";
import { TargetPort } from "../types/graphTypes";

export function isPortConnectable(portDrag: PortDrag | undefined, portTargets: TargetPort[] | undefined, nodeId: string, portType: string, portOut: boolean): boolean {
    if (!portDrag) {
        return false;
    } else {
        if (portTargets) {
            for (const target of portTargets) {
                if (target.node === portDrag.nodeId && target.port === portDrag.portId) {
                    return false;
                }
            }
        }

        return portDrag.nodeId !== nodeId
            && portOut !== portDrag.portOut
            && portDrag.portType === portType;
    }
}
