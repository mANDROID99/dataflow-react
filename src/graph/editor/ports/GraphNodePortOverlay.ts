import * as SVG from 'svg.js';
import { GraphEditor } from '../GraphEditor';
import { PortDragTarget } from '../../types/graphEditorTypes';
import { comparePortTargets } from '../helpers/ports';

const OVERLAY_RADIUS = 15;

export class GraphNodePortOverlay {
    private readonly editor: GraphEditor;
    private readonly container: SVG.G;
    private readonly port: PortDragTarget;

    private shape?: SVG.Circle;

    constructor(editor: GraphEditor, container: SVG.G, port: PortDragTarget) {
        this.editor = editor;
        this.container = container;
        this.port = port;
    }

    show(): void {
        if (!this.shape) {
            this.shape = this.container.circle()
                .addClass('graph-node-port-overlay')
                .radius(OVERLAY_RADIUS)
                .attr('opacity', 0)
                .on('mouseover', this.onMouseOver.bind(this))
                .on('mouseout', this.onMouseOut.bind(this));

            this.shape.animate(200).attr({ opacity: 1 });
        }
    }

    hide(): void {
        if (this.shape) {
            const shape = this.shape;
            this.shape = undefined;

            shape.animate(200)
                .attr({ opacity: 0 })
                .after(() => shape.remove());
        }
    }

    private onMouseOver(): void {
        this.editor.onTargetPortChanged(this.port);
    }

    private onMouseOut(): void {
        const target = this.editor.targetPort;
        if (comparePortTargets(target, this.port)) {
            this.editor.onTargetPortChanged(undefined);
        }
    }
}
