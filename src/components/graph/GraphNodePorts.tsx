import React from 'react';
import { NodeDef, PortAlign, PortDef } from "../../types/graphDefTypes";
import GraphNodePort from './GraphNodePort';

type Props<Params, Ctx> = {
    nodeId: string;
    nodeDef: NodeDef<Params, Ctx>;
    nodeWidth: number;
    nodeHeight: number;
}

type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
    portDef: PortDef;
}

function GraphNodePorts<Params, Ctx>({ nodeId, nodeDef, nodeWidth, nodeHeight }: Props<Params, Ctx>) {
    const portsLeft: PortRef[] = [];
    const portsRight: PortRef[] = [];
    const portsTop: PortRef[] = [];
    const portsBottom: PortRef[] = [];

    function append(align: PortAlign, portRef: PortRef) {
        switch(align) {
            case PortAlign.LEFT:
                portsLeft.push(portRef);
                break;
            case PortAlign.RIGHT:
                portsRight.push(portRef);
                break;
            case PortAlign.TOP:
                portsTop.push(portRef);
                break;
            case PortAlign.BOTTOM:
                portsBottom.push(portRef);
                break;
        }
    }

    function renderPorts(align: PortAlign, ports: PortRef[]) {
        return ports.length && ports.map((portRef, index, arr) => (
            <GraphNodePort
                key={(portRef.portOut ? 'out-' : 'in-') + portRef.portId}
                n={arr.length}
                {...portRef}
                align={align}
                nodeWidth={nodeWidth}
                nodeHeight={nodeHeight}
                index={index}
            />
        ));
    }

    const inputPorts = nodeDef.ports.in;
    for (let portId in inputPorts) {
        const port = inputPorts[portId];
        const align = port.align ?? PortAlign.LEFT;

        const portRef: PortRef = {
            nodeId,
            portId,
            portOut: false,
            portDef: port
        };
        
        append(align, portRef);
    }

    const outputPorts = nodeDef.ports.out;
    for (let portId in outputPorts) {
        const port = outputPorts[portId];
        const align = port.align ?? PortAlign.RIGHT;
        
        const portRef: PortRef = {
            nodeId,
            portId,
            portOut: true,
            portDef: port
        };

        append(align, portRef);
    }

    return (
        <>
            {renderPorts(PortAlign.LEFT, portsLeft)}
            {renderPorts(PortAlign.TOP, portsTop)}
            {renderPorts(PortAlign.RIGHT, portsRight)}
            {renderPorts(PortAlign.BOTTOM, portsBottom)}
        </>
    );
};

export default React.memo(GraphNodePorts) as typeof GraphNodePorts;
