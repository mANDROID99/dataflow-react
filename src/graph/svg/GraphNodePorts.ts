import * as SVG from 'svg.js';
import { GraphEditor } from "./GraphEditor";
import { Ports } from "../types/graphTypes";
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { GraphNodePort } from './GraphNodePort';
import { Size, NodeMeasurements } from './graphEditorTypes';

export class GraphNodePortsComponent {
    private readonly ports: GraphNodePort[];

    constructor(editor: GraphEditor, container: SVG.G, nodeId: string, portOut: boolean, portSpecs: GraphNodePortSpec[], ports: Ports) {
        this.ports = portSpecs.map(portSpec => {
            const portId = portSpec.name;
            const portTargets = ports[portId] || [];
            return new GraphNodePort(editor, container, portSpec, nodeId, portId, portOut, portTargets);
        })
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

    update(ports: Ports) {
        
    }
}

