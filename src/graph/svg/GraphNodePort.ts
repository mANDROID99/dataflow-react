import * as SVG from 'svg.js';
import { GraphEditor } from './GraphEditor';
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { NodeMeasurements } from './graphEditorTypes';

const LABEL_PADDING = 5;
const CIRCLE_RADIUS = 5;
const PORT_GROUP_HEIGHT = 25;

export class GraphNodePort {

    private readonly portOut: boolean;
    private readonly portGroup: SVG.G;
    private readonly labelText: SVG.Text;
    private readonly portConnector: SVG.Circle;

    constructor(
        editor: GraphEditor,
        container: SVG.G,
        portSpec: GraphNodePortSpec,
        nodeId: string,
        portId: string,
        portOut: boolean,
        portTargets: TargetPort[]
    ) {
        this.portOut = portOut;
        this.portGroup = container.group();

        this.labelText = this.portGroup.plain(portSpec.name)
            .addClass('graph-node-port-label')
            .attr('text-anchor', portOut ? 'end' : 'start')
            .attr('dominant-baseline', 'middle')
            .x(portOut ? -(LABEL_PADDING + CIRCLE_RADIUS) : LABEL_PADDING + CIRCLE_RADIUS );

        this.portConnector = this.portGroup.circle()
            .addClass('graph-node-port-connector')
            .radius(CIRCLE_RADIUS)
            .cx(0)
            .cy(0)
    }

    update(targets: TargetPort[]) {
        // TODO
    }

    resize(bounds: NodeMeasurements, index: number) {
        const x = this.portOut ? bounds.outerWidth : 0;
        const y = bounds.headerHeight + index * PORT_GROUP_HEIGHT + PORT_GROUP_HEIGHT / 2;
        this.portGroup.translate(x, y);
    }

    getSize() {
        const width = this.labelText.bbox().width + LABEL_PADDING * 2 + CIRCLE_RADIUS;
        return {
            width,
            height: PORT_GROUP_HEIGHT
        }
    }
}
