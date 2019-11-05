import * as SVG from 'svg.js';
import { GraphEditor } from '../GraphEditor';
import { TargetPort } from '../../types/graphTypes';
import { NodeMeasurements, Size, PortDragTarget } from '../../types/graphEditorTypes';
import { GraphConnection } from '../GraphConnection';
import { makeDraggable, DragState } from '../helpers/draggable';
import { Disposables } from '../helpers/disposables';
import { GraphNodePortDragConnection } from './GraphNodePortDragConnection';
import { comparePortTargets, isPortConnectable } from '../helpers/ports';
import { GraphNodePortOverlay } from './GraphNodePortOverlay';
import { EventType, GraphEditorEvent } from '../GraphEditorEvents';

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

    private offsetX = 0;
    private offsetY = 0;
    private attachX = 0;
    private attachY = 0;

    private registeredConnections: GraphConnection[] = [];
    private disposables: Disposables;

    constructor(editor: GraphEditor, container: SVG.G, port: PortDragTarget) {
        this.editor = editor;
        this.port = port;
        this.disposables = new Disposables();

        this.portGroup = container.group();
        this.labelText = this.createLabelTextShape(this.portGroup, port);
        this.portConnector = this.createPortConnectorShape(this.portGroup);
        this.overlay = new GraphNodePortOverlay(editor, this.portGroup, port);

        this.handleEvent = editor.addEventListener(this.handleEvent.bind(this));
    }

    onPortUpdated(targets: TargetPort[] | undefined, nodeX: number, nodeY: number): void {
        this.attachX = nodeX + this.offsetX;
        this.attachY = nodeY + this.offsetY;
    }

    onNodeDragged(dragX: number, dragY: number): void {
        this.attachX = dragX + this.offsetX;
        this.attachY = dragY + this.offsetY;
        for (const conn of this.registeredConnections) {
            conn.update();
        }
    }
    
    onNodeBoundsMeasured(bounds: NodeMeasurements, index: number): void {
        this.offsetX = this.port.portOut ? bounds.outerWidth : 0;
        this.offsetY = bounds.headerHeight + index * PORT_GROUP_HEIGHT + PORT_GROUP_HEIGHT / 2;
        this.portGroup.translate(this.offsetX, this.offsetY);
    }

    getSize(): Size {
        const width = this.labelText.bbox().width + LABEL_PADDING * 2 + CIRCLE_RADIUS;
        return {
            width,
            height: PORT_GROUP_HEIGHT
        };
    }

    getAttachX(): number {
        return this.attachX;
    }

    getAttachY(): number {
        return this.attachY;
    }

    remove(): void {
        this.disposables.dispose();
        this.editor.removeEventListener(this.handleEvent);
    }

    registerConnection(connection: GraphConnection): void {
        this.registeredConnections.push(connection);
    }

    unregisterConnection(connection: GraphConnection): void {
        this.registeredConnections.splice(this.registeredConnections.indexOf(connection), 1);
    }

    private createLabelTextShape(container: SVG.G, port: PortDragTarget): SVG.Text {
        const portLabel = port.portSpec.name;
        const portOut = port.portOut;

        return container.plain(portLabel)
            .addClass('graph-node-port-label')
            .attr('text-anchor', portOut ? 'end' : 'start')
            .attr('dominant-baseline', 'middle')
            .x(portOut ? -(LABEL_PADDING + CIRCLE_RADIUS) : LABEL_PADDING + CIRCLE_RADIUS );
    }

    private createPortConnectorShape(container: SVG.G): SVG.Circle {
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

    private onDragStart(): void {
        const container = this.editor.connectionsGroup;
        this.dragConnection = new GraphNodePortDragConnection(container, this.attachX, this.attachY);
        this.editor.onActivePortChanged(this.port);

        const port = this.port;
        if (!port.portOut) {
            this.editor.actions.clearPortConnections(port.nodeId, port.portId, port.portOut);
        }
    }

    private onDrag(_s: DragState, event: MouseEvent): void {
        if (this.dragConnection && !this.editor.targetPort) {
            this.dragConnection.update(event.clientX, event.clientY);
        }
    }

    private onDragEnd(): void {
        if (this.dragConnection) {
            this.dragConnection.remove();
        }

        const target = this.editor.targetPort;
        if (comparePortTargets(this.editor.activePort, this.port)) {
            this.editor.onActivePortChanged(undefined);

            if (target) {
                const port = this.port;
                this.editor.actions.addPortConnection(
                    port.nodeId, port.portId, port.portOut, target.nodeId, target.portId
                );
            }
        }
    }

    private handleEvent(event: GraphEditorEvent): void {
        if (event.type === EventType.TARGET_PORT_CHANGED) {
            const target = event.port;
            if (this.dragConnection && target) {
                const port = this.editor.findNodePort(target.nodeId, target.portId, target.portOut);

                if (port) {
                    const px = port.getAttachX();
                    const py = port.getAttachY();
                    this.dragConnection.update(px, py);
                }
            }

        } else if (event.type === EventType.ACTIVE_PORT_CHANGED) {
            const target = event.port;
            if (target != null && isPortConnectable(target, this.port)) {
                this.overlay.show();
            } else {
                this.overlay.hide();
            }
        }
    }
}
