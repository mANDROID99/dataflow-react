import * as SVG from 'svg.js';
import { GraphEditor } from './GraphEditor';
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { NodeMeasurements, Size } from './graphEditorTypes';
import { GraphConnection } from './GraphConnection';
import { makeDraggable } from './helpers/draggable';
import { Disposables } from './helpers/disposables';

const LABEL_PADDING = 5;
const CIRCLE_RADIUS = 5;
const PORT_GROUP_HEIGHT = 25;

export class GraphNodePortComponent {
    private readonly editor: GraphEditor;
    private readonly nodeId: string;
    private readonly portId: string;

    private readonly portOut: boolean;
    private readonly portGroup: SVG.G;
    private readonly labelText: SVG.Text;
    private readonly portConnector: SVG.Circle;

    private offsetX: number = 0;
    private offsetY: number = 0;

    private attachX: number = 0;
    private attachY: number = 0;

    private registeredConnections: GraphConnection[] = [];
    private disposables: Disposables;

    constructor(
        editor: GraphEditor,
        container: SVG.G,
        portSpec: GraphNodePortSpec,
        nodeId: string,
        portId: string,
        portOut: boolean
    ) {
        this.editor = editor;
        this.nodeId = nodeId;
        this.portId = portId;
        this.portOut = portOut;
        this.portGroup = container.group();
        this.disposables = new Disposables();

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

        this.disposables.push(makeDraggable(this.portConnector, {
            onDrag: this.onDrag.bind(this)
        }));
    }

    update(targets: TargetPort[] | undefined, nodeX: number, nodeY: number) {
        this.attachX = nodeX + this.offsetX;
        this.attachY = nodeY + this.offsetY;
    }

    setDrag(dragX: number, dragY: number) {
        this.attachX = dragX + this.offsetX;
        this.attachY = dragY + this.offsetY;
        for (let conn of this.registeredConnections) {
            conn.update();
        }
    }

    resize(bounds: NodeMeasurements, index: number) {
        const x = this.portOut ? bounds.outerWidth : 0;
        const y = bounds.headerHeight + index * PORT_GROUP_HEIGHT + PORT_GROUP_HEIGHT / 2;

        this.offsetX = x;
        this.offsetY = y;

        this.portGroup.translate(x, y);
    }

    getSize(): Size {
        const width = this.labelText.bbox().width + LABEL_PADDING * 2 + CIRCLE_RADIUS;
        return {
            width,
            height: PORT_GROUP_HEIGHT
        }
    }

    getAttachX(): number {
        return this.attachX;
    }

    getAttachY(): number {
        return this.attachY;
    }

    remove() {
        this.disposables.dispose();   
    }

    registerConnection(connection: GraphConnection) {
        this.registeredConnections.push(connection);
    }

    unregisterConnection(connection: GraphConnection) {
        this.registeredConnections.splice(this.registeredConnections.indexOf(connection), 1);
    }

    private onDrag(dx: number, dy: number) {

    }

    private onDragEnd(dx: number, dy: number) {
        
    }
}
