import * as SVG from 'svg.js';
import { GraphNode } from "../types/graphTypes";
import { GraphEditor } from './GraphEditor';
import { NodeMeasurements } from './graphEditorTypes';
import { GraphNodePortsManager } from './GraphNodePortsManager';
import { GraphNodeSpec } from '../types/graphSpecTypes';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { makeDraggable } from './helpers/draggable';
import { Disposables } from './helpers/disposables';
import { GraphNodePortComponent } from './GraphNodePort';
library.add(faTimes);

const HEADER_CLOSE_BTN_SIZE = 20;
const HEADER_PAD = 5;
const HEADER_HEIGHT = 30;

export class GraphNodeComponent {
    private readonly editor: GraphEditor;
    private readonly nodeId: string;
    private readonly group: SVG.G;
    private readonly spec: GraphNodeSpec;

    private readonly backRect: SVG.Rect;
    private readonly titleText: SVG.Text;
    private readonly closeBtn: SVG.G;

    private readonly portsIn: GraphNodePortsManager;
    private readonly portsOut: GraphNodePortsManager;
    private readonly disposables: Disposables = new Disposables();

    private node: GraphNode;
    
    constructor(editor: GraphEditor, container: SVG.G, nodeId: string, node: GraphNode) {
        this.editor = editor;
        this.nodeId = nodeId;
        this.node = node;
        this.spec = this.getSpec(node.type);

        this.group = container.group().addClass('graph-node-container');
        this.backRect = this.createBackRect(this.group);
        this.titleText = this.createTitle(this.group);
        this.closeBtn = this.createCloseButton(this.group);

        this.portsIn = new GraphNodePortsManager(editor, this.group, nodeId, false, this.spec.ports.in);
        this.portsOut = new GraphNodePortsManager(editor, this.group, nodeId, true, this.spec.ports.out);

        this.resize();
        this.update();
    }

    setNode(node: GraphNode) {
        if (this.node !== node) {
            this.node = node;
            this.update();
        }
    }
    
    remove() {
        this.disposables.dispose();
        this.group.remove();
        this.portsIn.remove();
        this.portsOut.remove();
    }

    getPortComponent(port: string, portOut: boolean): GraphNodePortComponent | undefined {
        if (portOut) {
            return this.portsOut.getPortComponent(port);
        } else {
            return this.portsIn.getPortComponent(port);
        }
    }

    private update() {
        const node = this.node;
        this.group.translate(node.x, node.y);
        this.portsIn.update(node.ports.in, node.x, node.y);
        this.portsOut.update(node.ports.out, node.x, node.y);
    }

    private resize() {
        const m = this.measure();

        this.titleText.center(m.outerWidth / 2, HEADER_HEIGHT / 2);
        this.closeBtn.translate(m.outerWidth - HEADER_PAD - HEADER_CLOSE_BTN_SIZE, HEADER_PAD);
        
        this.backRect
            .width(m.outerWidth)
            .height(m.outerHeight);

        this.portsIn.resize(m);
        this.portsOut.resize(m);
    }

    private measure(): NodeMeasurements {
        const widthTitle = this.titleText.bbox().width;
        const widthHeader = widthTitle + (HEADER_CLOSE_BTN_SIZE + HEADER_PAD * 2) * 2

        const sizePortsIn = this.portsIn.getSize();
        const sizePortsOut = this.portsOut.getSize();
        const widthBody = sizePortsIn.width + this.spec.width + sizePortsOut.width;
        const heightBody = Math.max(sizePortsIn.height, sizePortsOut.height);

        const width = Math.max(widthHeader, widthBody);
        const height = HEADER_HEIGHT + heightBody;

        return {
            headerHeight: HEADER_HEIGHT,
            outerWidth: width,
            outerHeight: height
        };
    }

    private createBackRect(nodeGroup: SVG.G) {
        const rect = nodeGroup.rect()
            .addClass('graph-node-back');

        this.disposables.push(makeDraggable(rect, {
            onDrag: this.onDrag.bind(this),
            onEnd: this.onDragEnd.bind(this)
        }));
        
        return rect;
    }

    private createTitle(nodeGroup: SVG.G): SVG.Text {
        const title = this.spec.title;
        return nodeGroup.plain(title)
            .addClass('graph-node-title');
    }

    private createCloseButton(nodeGroup: SVG.G): SVG.G {
        const closeGroup = nodeGroup.group()
            .addClass('graph-node-close');

        // close overlay
        closeGroup.circle(HEADER_CLOSE_BTN_SIZE)
            .addClass('graph-node-close-overlay')
            .cx(HEADER_CLOSE_BTN_SIZE / 2)
            .cy(HEADER_CLOSE_BTN_SIZE / 2)
            .on('click', this.handleRemove.bind(this));

        // close icon
        const fo = closeGroup.element('foreignObject')
            .addClass('graph-node-close-icon')
            .width(HEADER_CLOSE_BTN_SIZE)
            .height(HEADER_CLOSE_BTN_SIZE)
            .style('line-height', HEADER_CLOSE_BTN_SIZE + 'px')
            .style('pointer-events', 'none');

        fo.node!.innerHTML = '<i class="fas fa-times"></i>';

        return closeGroup;
    }

    private handleRemove() {
        const actions = this.editor.getActions();
        actions.removeNode(this.nodeId);
    }

    private getSpec(nodeType: string) {
        return this.editor.getSpec().nodes[nodeType];
    }

    private onDrag(dx: number, dy: number) {
        const x = this.node.x + dx;
        const y = this.node.y + dy;

        this.group.translate(x, y);
        this.portsIn.setDrag(x, y);
        this.portsOut.setDrag(x, y);
    }

    private onDragEnd(dx: number, dy: number) {
        const x = this.node.x + dx;
        const y = this.node.y + dy;

        this.editor.getActions()
            .setNodePosition(this.nodeId, x, y);
    }
}
