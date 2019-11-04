import * as SVG from 'svg.js';
import { GraphNodePortComponent } from './GraphNodePort';

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
    
    remove() {
        // unregister this connection
        this.start.unregisterConnection(this);
        this.end.unregisterConnection(this);

        this.path.remove();
    }

    update() {
        const sx = this.start.getAttachX();
        const sy = this.start.getAttachY();

        const ex = this.end.getAttachX();
        const ey = this.end.getAttachY();

        const d = `M${sx},${sy}L${ex},${ey}`;
        this.path.plot(d);
    }
}
