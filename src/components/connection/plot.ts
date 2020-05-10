import { PortPos } from "../../redux/editorSelectors";
import { PortAlign } from "../../types/graphDefTypes";

const OFF_DIST = 15;
const ARROW_HEIGHT = 4;
const ARROW_WIDTH = 6;

export type Pos = [number, number];

function getOffsetPos(sx: number, sy: number, ex: number, ey: number, align: PortAlign | undefined): Pos {
    const cx = (sx + ex) / 2;
    const cy = (sy + ey) / 2;

    let x = sx
    let y = sy;

    if (align === PortAlign.LEFT) {
        if (x > cx) {
            x = Math.max(x - OFF_DIST, cx);
        }
    } else if (align === PortAlign.TOP) {
        if (y > cy) {
            y = Math.max(y - OFF_DIST, cy);
        }
    } else if (align === PortAlign.RIGHT) {
        if (x < cx) {
            x = Math.min(x + OFF_DIST, cx);
        }
    } else if (align === PortAlign.BOTTOM) {
        if (y < cy) {
            y = Math.min(y + OFF_DIST, cx);
        }
    }

    return [x, y];
}

export function plotConnection(source: PortPos, ex: number, ey: number, targetAlign?: PortAlign) {
    const sx = source.x;
    const sy = source.y;
    const pt1 = getOffsetPos(sx, sy, ex, ey, source.align);
    const pt2 = getOffsetPos(ex, ey, sx, sy, targetAlign);
    return `M${sx} ${sy}L${pt1[0]} ${pt1[1]}L${pt2[0]} ${pt2[1]}L${ex} ${ey}`;
}

export function plotArrow(source: PortPos, target: PortPos) {
    const [sx, sy] = getOffsetPos(source.x, source.y, target.x, target.y, source.align);
    const [ex, ey] = getOffsetPos(target.x, target.y, source.x, source.y, target.align);

    // compute the direction vector
    let dx = ex - sx;
    let dy = ey - sy;

    // the point at the center of the triangle
    const cx = sx + dx / 2;
    const cy = sy + dy / 2; 

    // normalize the direction vector
    const len = Math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;

    // first point is at the tip
    const p1x = cx + dx * ARROW_HEIGHT;
    const p1y = cy + dy * ARROW_HEIGHT;

    // calculate the direction normal
    const nx = dy;
    const ny = -dx;

    // the point at the center of the triangles base
    const baseX = cx - dx * ARROW_HEIGHT;
    const baseY = cy - dy * ARROW_HEIGHT;

    // second point is to the left
    const p2x = baseX + nx * ARROW_WIDTH;
    const p2y = baseY + ny * ARROW_WIDTH;

    // third point is to the right
    const p3x = baseX - nx * ARROW_WIDTH;
    const p3y = baseY - ny * ARROW_WIDTH;
    return `M${p1x} ${p1y}L${p2x} ${p2y}L${p3x} ${p3y}Z`;
}

