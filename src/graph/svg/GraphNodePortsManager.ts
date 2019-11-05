import * as SVG from 'svg.js';
import { GraphEditor } from "./GraphEditor";
import { Ports } from "../types/graphTypes";
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { GraphNodePortComponent } from './ports/GraphNodePort';
import { Size, NodeMeasurements, PortDragTarget } from './graphEditorTypes';

export class GraphNodePortsManager {
    private readonly portSpecs: GraphNodePortSpec[];
    private readonly ports: GraphNodePortComponent[];
    private readonly portsById: Map<string, GraphNodePortComponent>;

    constructor(editor: GraphEditor, container: SVG.G, nodeId: string, portOut: boolean, portSpecs: GraphNodePortSpec[]) {
        this.portSpecs = portSpecs;

        const [ports, portsById] = this.createPorts(editor, container, nodeId, portOut, portSpecs);
        this.ports = ports;
        this.portsById = portsById;
    }

    getSize(): Size {
        let width = 0;
        let height = 0;

        for (let port of this.ports) {
            const s = port.getSize();
            if (s.width > width) {
                width = s.width;
            }
            
            height += s.height;
        }

        return {
            width,
            height
        };
    }

    onNodeBoundsMeasured(bounds: NodeMeasurements) {
        let i = 0;
        for (let port of this.ports) {
            port.onNodeBoundsMeasured(bounds, i++);
        }
    }

    onPortsUpdated(ports: Ports, nodeX: number, nodeY: number) {
        const portSpecs = this.portSpecs;
        for (let i = 0, n = portSpecs.length; i < n; i++) {
            const portName = portSpecs[i].name;
            const portTargets = ports[portName];
            this.ports[i].onPortUpdated(portTargets!, nodeX, nodeY);
        }
    }

    onNodeDragged(dragX: number, dragY: number) {
        for (let port of this.ports) {
            port.onNodeDragged(dragX, dragY);
        }
    }

    onPortDragChanged(portDrag: PortDragTarget | undefined) {
        for (let port of this.ports) {
            port.onPortDragChanged(portDrag);
        }
    }

    getPortComponent(port: string): GraphNodePortComponent | undefined {
        return this.portsById.get(port);
    }

    remove() {
        for (let port of this.ports) {
            port.remove();
        }
    }

    private createPorts(editor: GraphEditor, container: SVG.G, nodeId: string, portOut: boolean, portSpecs: GraphNodePortSpec[]) {
        const portsById = new Map<string, GraphNodePortComponent>();
        const ports = portSpecs.map(portSpec => {
            const portId = portSpec.name;
            const port: PortDragTarget = { nodeId, portId, portOut, portSpec };
            const component = new GraphNodePortComponent(editor, container, port);
            portsById.set(portId, component);
            return component;
        });

        return [ports, portsById] as const;
    }
}

