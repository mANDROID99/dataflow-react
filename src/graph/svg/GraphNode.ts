import * as SVG from 'svg.js';
import { GraphNode } from "../types/graphTypes";
import { GraphEditor } from './GraphEditor';
import { NodeMeasurements } from './graphEditorTypes';
import { GraphNodePortsComponent } from './GraphNodePorts';
import { GraphNodeSpec } from '../types/graphSpecTypes';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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

    private readonly portsIn: GraphNodePortsComponent;
    private readonly portsOut: GraphNodePortsComponent;

    private node!: GraphNode;
    
    constructor(editor: GraphEditor, container: SVG.G, nodeId: string, node: GraphNode) {
        this.editor = editor;
        this.nodeId = nodeId;
        this.spec = this.getSpec(node.type);

        this.group = container.group().addClass('graph-node-container');
        this.backRect = this.createBackRect(this.group);
        this.titleText = this.createTitle(this.group, node);
        this.closeBtn = this.createCloseButton(this.group);

        this.portsIn = new GraphNodePortsComponent(editor, this.group, nodeId, false, this.spec.ports.in, node.ports.in);
        this.portsOut = new GraphNodePortsComponent(editor, this.group, nodeId, true, this.spec.ports.out, node.ports.out);

        this.resize();
        this.update(node);
    }

    update(node: GraphNode) {
        if (this.node !== node) {
            this.node = node;
            this.group.translate(node.x, node.y);
        }
    }
    
    remove() {
        this.group.remove();
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
        const widthHeader = widthTitle + (HEADER_CLOSE_BTN_SIZE + HEADER_PAD) * 2

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
        return nodeGroup.rect()
            .addClass('graph-node-back');
    }

    private createTitle(nodeGroup: SVG.G, node: GraphNode): SVG.Text {
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
}
