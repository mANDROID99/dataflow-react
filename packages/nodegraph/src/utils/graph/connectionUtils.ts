import { TargetPorts, Graph, TargetPort } from "../../types/graphTypes";
import { PortRef } from "../../types/graphReducerTypes";
import { GraphConfig } from "../../types/graphConfigTypes";
import { getPortInConfig } from "./portUtils";

function hasTarget(targets: TargetPort[] | undefined, target: PortRef) {
    if (targets && targets.length) {
        for (const tgt of targets) {
            if (tgt.node === target.nodeId && tgt.port === target.portId) {
                return true;
            }
        }
    }
    return false;
}


function addPortTarget(ports: TargetPorts, portId: string, target: PortRef) {
    let targets = ports[portId];
    if (!targets) {
        targets = [];
        ports[portId] = targets;
    }

    targets.push({
        node: target.nodeId,
        port: target.portId
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

export function createConnection(graph: Graph, graphConfig: GraphConfig<any>, start: PortRef, end: PortRef) {
    const startNode = graph.nodes[start.nodeId];
    const endNode = graph.nodes[end.nodeId];
    if (!startNode || !endNode) return;

    const portOut = start.portOut;
    if (portOut) {
        // check if already connected
        const startPorts = startNode.ports.out;
        if (startPorts && hasTarget(startPorts[start.portId], end)) {
            return;
        }
        
        // add connection start -> end
        addPortTarget(startPorts, start.portId, end);
        const endPorts = endNode.ports.in;
        const endTargets = endPorts[end.portId];
        
        // clear previous connection
        if (endTargets) {
            const endPortConfig = getPortInConfig(graphConfig, endNode.type, end.portId);
            if (endPortConfig && !endPortConfig.multi) {
                clearPortTargets(graph, endTargets, end.nodeId, end.portId, false);
            }
        }
        
        // add connection end -> start
        addPortTarget(endPorts, end.portId, start);

    } else {
        const startPorts = startNode.ports.in;
        const startTargets = startPorts[start.portId];
        
        // clear previous connection
        if (startTargets) {
            const startPortConfig = getPortInConfig(graphConfig, startNode.type, start.portId);
            if (startPortConfig && !startPortConfig.multi) {
                clearPortTargets(graph, startTargets, start.nodeId, start.portId, false);
            }
        }

        // add connection start -> end
        addPortTarget(startPorts, start.portId, end);

        // add connection end -> start
        const endPorts = endNode.ports.out;
        addPortTarget(endPorts, end.portId, start);
    }
}

