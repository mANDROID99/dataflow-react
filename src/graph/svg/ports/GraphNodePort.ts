import * as SVG from 'svg.js';
import { GraphEditor } from '../GraphEditor';
import { GraphNodePortSpec } from '../../types/graphSpecTypes';
import { TargetPort } from '../../types/graphTypes';
import { NodeMeasurements, Size, PortDragTarget } from '../graphEditorTypes';
import { GraphConnection } from '../GraphConnection';
import { makeDraggable, DragState } from '../helpers/draggable';
import { Disposables } from '../helpers/disposables';
import { GraphNodePortDragConnection } from './GraphNodePortDragConnection';
import { comparePortTargets, isPortConnectable } from '../helpers/ports';
import { GraphNodePortOverlay } from './GraphNodePortOverlay';

const LABEL_PADDING = 5;
const CIRCLE_RADIUS = 5;
const PORT_GROUP_HEIGHT = 25;

export class GraphNodePortComponent {
    private readonly editor: GraphEditor;
    private readonly port: PortDragTarget;

    private readonly portGroup: SVG.G;
    private readonly labelText: SVG.Text;
    private readonly portConnector: SVG.Circle;

    private dragConnection?: GraphNodePortDragConnection;
    private overlay: GraphNodePortOverlay;

    private offsetX: number = 0;
    private offsetY: number = 0;
    private attachX: number = 0;
    private attachY: number = 0;

    private registeredConnections: GraphConnection[] = [];
    private disposables: Disposables;

    constructor(editor: GraphEditor, container: SVG.G, port: PortDragTarget) {
        this.editor = editor;
        this.port = port;
        this.disposables = new Disposables();

        this.portGroup = container.group();
        this.labelText = this.createLabelTextShape(this.portGroup, port);
        this.portConnector = this.createPortConnectorShape(this.portGroup);
        this.overlay = new GraphNodePortOverlay(this.portGroup);
    }

    onPortUpdated(targets: TargetPort[] | undefined, nodeX: number, nodeY: number) {
        this.attachX = nodeX + this.offsetX;
        this.attachY = nodeY + this.offsetY;
    }

    onNodeDragged(dragX: number, dragY: number) {
        this.attachX = dragX + this.offsetX;
        this.attachY = dragY + this.offsetY;
        for (let conn of this.registeredConnections) {
            conn.update();
        }
    }

    onPortDragChanged(portDrag: PortDragTarget | undefined) {
        if (portDrag != null && isPortConnectable(portDrag, this.port)) {
            this.overlay.show();
        } else {
            this.overlay.hide();
        }
    }

    onNodeBoundsMeasured(bounds: NodeMeasurements, index: number) {
        this.offsetX = this.port.portOut ? bounds.outerWidth : 0;
        this.offsetY = bounds.headerHeight + index * PORT_GROUP_HEIGHT + PORT_GROUP_HEIGHT / 2;
        this.portGroup.translate(this.offsetX, this.offsetY);
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

    private createLabelTextShape(container: SVG.G, port: PortDragTarget) {
        const portLabel = port.portSpec.name;
        const portOut = port.portOut;

        return container.plain(portLabel)
            .addClass('graph-node-port-label')
            .attr('text-anchor', portOut ? 'end' : 'start')
            .attr('dominant-baseline', 'middle')
            .x(portOut ? -(LABEL_PADDING + CIRCLE_RADIUS) : LABEL_PADDING + CIRCLE_RADIUS );
    }

    private createPortConnectorShape(container: SVG.G) {
        const shape = container.circle()
            .addClass('graph-node-port-connector')
            .radius(CIRCLE_RADIUS)
            .cx(0)
            .cy(0);

        this.disposables.push(makeDraggable(shape, {
            onStart: this.onDragStart.bind(this),
            onDrag: this.onDrag.bind(this),
            onEnd: this.onDragEnd.bind(this)
        }));

        return shape;
    }

    private onDragStart() {
        const container = this.editor.getConnectionsGroup();
        this.dragConnection = new GraphNodePortDragConnection(container, this.attachX, this.attachY);
        this.editor.onPortDragChanged(this.port);
    }

    private onDrag(_s: DragState, event: MouseEvent) {
        if (this.dragConnection) {
            this.dragConnection.update(event.clientX, event.clientY);
        }
    }

    private onDragEnd() {
        if (this.dragConnection) {
            this.dragConnection.remove();
        }

        const portDrag = this.editor.getPortDrag();
        if (comparePortTargets(portDrag, this.port)) {
            this.editor.onPortDragChanged(undefined);
        }
    }
}
