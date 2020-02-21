import { NodeBounds } from '../types/storeTypes';

function hitTest(a1: number, a2: number, b1: number, b2: number) {
    return !(a1 >= b2 && a2 >= b2 || a1 <= b1 && a2 <= b1);
}

function hitTestBounds(a: NodeBounds, b: NodeBounds) {
    return hitTest(a.x, a.x + a.width, b.x, b.x + b.width)
        && hitTest(a.y, a.y + a.height, b.y, b.y + b.height);
}

export function updateBoundsOverlapping(allBounds: { [key: string]: NodeBounds }, allNodeIds: string[], startNodeId: string, margin: number) {
    const seen = new Set<string>();
    allNodeIds.sort((a, b) => allBounds[a].y - allBounds[b].y);

    function update(testNodeId: string) {
        seen.add(testNodeId);
        const bounds = allBounds[testNodeId];
        const next: string[] = [];

        for (const nodeId of allNodeIds) {
            if (nodeId !== testNodeId && !seen.has(nodeId)) {
                const otherBounds = allBounds[nodeId];

                if (otherBounds.alignBottomEdge === testNodeId || hitTestBounds(bounds, otherBounds)) {
                    otherBounds.y = bounds.y + bounds.height + margin;
                    otherBounds.alignBottomEdge = testNodeId;
                    next.push(nodeId);
                }
            }
        }

        for (const n of next) {
            if (!seen.has(n)) {
                update(n);
            }
        }
    }

    update(startNodeId);
    return seen;
}

export function clearAlignment(allBounds: { [key: string]: NodeBounds }, nodeId: string) {
    let bounds = allBounds[nodeId];
    if (!bounds) return;

    bounds.alignBottomEdge = undefined;

    for (const id in allBounds) {
        bounds = allBounds[id];

        if (bounds.alignBottomEdge === nodeId) {
            bounds.alignBottomEdge = undefined;
        }
    }
}
