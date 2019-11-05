import * as SVG from 'svg.js';
import { lineBetween } from '../helpers/paths';

export class GraphNodePortDragConnection {
    private readonly sx: number;
    private readonly sy: number;
    private readonly shape: SVG.Path;

    constructor(container: SVG.G, sx: number, sy: number) {
        this.sx = sx;
        this.sy = sy;
        this.shape = this.createShape(container);
    }

    private createShape(container: SVG.G) {
        return container.path()
            .addClass('graph-node-port-dragger');
    }

    update(mouseX: number, mouseY: number) {
        this.shape.plot(lineBetween(this.sx, this.sy, mouseX, mouseY));
    }

    remove() {
        this.shape.remove();
    }
}


