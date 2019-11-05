import * as SVG from 'svg.js';
import { GraphNodePortComponent } from './ports/GraphNodePort';
import { lineBetween } from './helpers/paths';

export class GraphConnection {
    private readonly start: GraphNodePortComponent;
    private readonly end: GraphNodePortComponent;
    private readonly path: SVG.Path;

    constructor(container: SVG.G, start: GraphNodePortComponent, end: GraphNodePortComponent) {
        this.start = start;
        this.end = end;

        // register this connection with the port
        start.registerConnection(this);
        end.registerConnection(this);

        this.path = container.path()
            .addClass('graph-connection');

        this.update();
    }
    
    remove(): void {
        // unregister this connection
        this.start.unregisterConnection(this);
        this.end.unregisterConnection(this);
        this.path.remove();
    }

    update(): void {
        const sx = this.start.attachX;
        const sy = this.start.attachY;
        const ex = this.end.attachX;
        const ey = this.end.attachY;
        this.path.plot(lineBetween(sx, sy, ex, ey));
    }
}
