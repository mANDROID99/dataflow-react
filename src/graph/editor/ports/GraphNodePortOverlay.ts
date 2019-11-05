import * as SVG from 'svg.js';

const OVERLAY_RADIUS = 20;

export class GraphNodePortOverlay {
    private readonly container: SVG.G;

    private shape?: SVG.Circle;

    constructor(container: SVG.G) {
        this.container = container;
    }

    show(): void {
        if (!this.shape) {
            this.shape = this.container.circle()
                .addClass('graph-node-port-overlay')
                .radius(OVERLAY_RADIUS)
                .attr('opacity', 0);

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
}
