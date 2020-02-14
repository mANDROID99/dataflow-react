import { updateBoundsOverlapping } from '../src/store/boundsUpdater';

test('update node height, detects overlap', () => {
    const bounds = {
        'node-1': { x: 0, y: 70, width: 40, height: 70 },
        'node-2': { x: 0, y: 60, width: 40, height: 50 }
    };

    updateBoundsOverlapping(bounds, 'node-1', 3);
    expect(bounds).toEqual({
        'node-1': { x: 0, y: 70, width: 40, height: 70 },
        'node-2': { x: 0, y: 143, width: 40, height: 50, alignBottomEdge: 'node-1' }
    });
});

test('update node height, overlaps cascade', () => {
    const bounds = {
        'node-1': { x: 0, y: 0, width: 40, height: 70 },
        'node-2': { x: 0, y: 60, width: 40, height: 50 },
        'node-3': { x: 0, y: 100, width: 40, height: 50 }
    };
    updateBoundsOverlapping(bounds, 'node-1', 3);
    expect(bounds).toEqual({
        'node-1': { x: 0, y: 0, width: 40, height: 70 },
        'node-2': { x: 0, y: 73, width: 40, height: 50, alignBottomEdge: 'node-1' },
        'node-3': { x: 0, y: 126, width: 40, height: 50, alignBottomEdge: 'node-2' }
    });
});

test('update node width, keeps order by distance', () => {
    const bounds = {
        'node-1': { x: 0, y: 0, width: 40, height: 70 },
        'node-2': { x: 0, y: 60, width: 40, height: 50 },
        'node-3': { x: 0, y: 80, width: 40, height: 50 },
        'node-4': { x: 0, y: 70, width: 40, height: 50 },
        'node-5': { x: 0, y: 90, width: 40, height: 50 }
    };
    updateBoundsOverlapping(bounds, 'node-1', 3);
    expect(bounds).toEqual({
        'node-1': { x: 0, y: 0, width: 40, height: 70 },
        'node-2': { x: 0, y: 73, width: 40, height: 50, alignBottomEdge: 'node-1' },
        'node-3': { x: 0, y: 179, width: 40, height: 50, alignBottomEdge: 'node-4' },
        'node-4': { x: 0, y: 126, width: 40, height: 50, alignBottomEdge: 'node-2' },
        'node-5': { x: 0, y: 232, width: 40, height: 50, alignBottomEdge: 'node-3' },
    });
});

