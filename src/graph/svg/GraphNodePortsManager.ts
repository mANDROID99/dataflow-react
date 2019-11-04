import * as SVG from 'svg.js';
import { GraphEditor } from "./GraphEditor";
import { Ports } from "../types/graphTypes";
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { GraphNodePortComponent } from './GraphNodePort';
import { Size, NodeMeasurements } from './graphEditorTypes';

export class GraphNodePortsManager {
    private readonly portSpecs: GraphNodePortSpec[];
    private readonly ports: GraphNodePortComponent[];
    private readonly portsById: Map<string, GraphNodePortComponent>;

    constructor(editor: GraphEditor, container: SVG.G, nodeId: string, portOut: boolean, portSpecs: GraphNodePortSpec[]) {
        this.portSpecs = portSpecs;
        this.portsById = new Map<string, GraphNodePortComponent>();
        this.ports = [];

        for (let portSpec of portSpecs) {
            const portId = portSpec.name;
            const portComponent = new GraphNodePortComponent(editor, container, portSpec, nodeId, portId, portOut);

            this.ports.push(portComponent);
            this.portsById.set(portId, portComponent);
        }
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

    resize(bounds: NodeMeasurements) {
        let i = 0;
        for (let port of this.ports) {
            port.resize(bounds, i++);
        }
    }

    update(ports: Ports, nodeX: number, nodeY: number) {
        const portSpecs = this.portSpecs;
        for (let i = 0, n = portSpecs.length; i < n; i++) {
            const portName = portSpecs[i].name;
            const portTargets = ports[portName];
            this.ports[i].update(portTargets!, nodeX, nodeY);
        }
    }

    setDrag(dragX: number, dragY: number) {
        for (let port of this.ports) {
            port.setDrag(dragX, dragY);
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
}

