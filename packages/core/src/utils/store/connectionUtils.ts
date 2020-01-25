import { TargetPorts, Graph, TargetPort } from "../../types/graphTypes";
import { PortTarget } from "../../types/storeTypes";

function hasTarget(targets: TargetPort[] | undefined, target: PortTarget) {
    if (targets && targets.length) {
        for (const tgt of targets) {
            if (tgt.node === target.nodeId && tgt.port === target.portName) {
                return true;
            }
        }
    }
    return false;
}

function addPortTarget(ports: TargetPorts, portId: string, target: PortTarget) {
    let targets = ports[portId];
    if (!targets) {
        targets = [];
        ports[portId] = targets;
    }

    targets.push({
        node: target.nodeId,
        port: target.portName
    });
}

export function clearPortTargets(graph: Graph, targets: TargetPort[], nodeId: string, portId: string, portOut: boolean) {
    if (targets.length > 0) {
        for (const target of targets) {
            const targetNode = graph.nodes[target.node];
            if (!targetNode) continue;

            const ports = portOut ? targetNode.ports.in : targetNode.ports.out;
            const targetPorts = ports[target.port];
            if (!targetPorts) continue;

            const index = targetPorts.findIndex(p => p.node === nodeId && p.port === portId);
            if (index < 0) continue;

            targetPorts.splice(index, 1);
        }

        targets.length = 0;
    }
}

export function createConnection(graph: Graph, start: PortTarget, end: PortTarget) {
    const startNode = graph.nodes[start.nodeId];
    const endNode = graph.nodes[end.nodeId];
    if (!startNode || !endNode) return;

    const portOut = start.portOut;
    if (portOut) {
        // check if already connected
        const startPorts = startNode.ports.out;
        if (startPorts && hasTarget(startPorts[start.portName], end)) {
            return;
        }
        
        // add connection start -> end
        addPortTarget(startPorts, start.portName, end);
        const endPorts = endNode.ports.in;
        const endTargets = endPorts[end.portName];
        
        // clear previous connection
        if (endTargets && !end.connectMulti) {
            clearPortTargets(graph, endTargets, end.nodeId, end.portName, false);
        }
        
        // add connection end -> start
        addPortTarget(endPorts, end.portName, start);

    } else {
        const startPorts = startNode.ports.in;
        const startTargets = startPorts[start.portName];
        
        // clear previous connection
        if (startTargets && !start.connectMulti) {
            clearPortTargets(graph, startTargets, start.nodeId, start.portName, false);
        }

        // add connection start -> end
        addPortTarget(startPorts, start.portName, end);

        // add connection end -> start
        const endPorts = endNode.ports.out;
        addPortTarget(endPorts, end.portName, start);
    }
}
