import { createSubNodesSelector } from '../src/store/selectors';
import { createInitialState } from '../src/store/initialState';
import { GraphNode } from '../src/types/graphTypes';

function graphNode(id: string): GraphNode {
    return {
        id,
        name: '',
        x: 0,
        y: 0,
        fields: {},
        height: 0,
        width: 0,
        ports: {
            in: {},
            out: {}
        },
        type: '',
    };
}

test('returns a sub-selection', () => {
    const node1 = graphNode('node-1');
    const node2 = graphNode('node-2');

    const state = createInitialState();
    state.graph.nodeIds = ['node-1'];
    state.graph.nodes = {
        'node-1': node1,
        'node-2': node2
    };

    const selector = createSubNodesSelector();
    const result = selector({ editor: state });

    expect(result).toEqual({
        'node-1': node1
    });
});

test('returns the same instance when nothing changed', () => {
    const node1 = graphNode('node-1');
    const state = createInitialState();
    state.graph.nodeIds = ['node-1'];
    state.graph.nodes = {
        'node-1': node1
    };

    const selector = createSubNodesSelector();
    const r1 = selector({ editor: state });
    const r2 = selector({ editor: state });
    expect(r1).toBe(r2);
});

test('returns a different instance when a node changed', () => {
    const node1 = graphNode('node-1');
    const state = createInitialState();
    state.graph.nodeIds = ['node-1'];
    state.graph.nodes = {
        'node-1': node1
    };

    const selector = createSubNodesSelector();
    const r1 = selector({ editor: state });
    expect(r1['node-1']).toBe(node1);

    const node2 = graphNode('node-2');
    state.graph.nodes = {
        'node-1': node2
    };

    const r2 = selector({ editor: state });
    expect(r1).not.toBe(r2);
    expect(r2['node-1']).toBe(node2);
});


test('returns the same instance when a node outside the scope changed', () => {
    const node1 = graphNode('node-1');
    const node2 = graphNode('node-2');

    const state = createInitialState();
    state.graph.nodeIds = ['node-1'];
    state.graph.nodes = {
        'node-1': node1,
        'node-2': node2 
    };

    const selector = createSubNodesSelector();
    const r1 = selector({ editor: state });

    state.graph.nodes = {
        'node-1': node1,
        'node-2': graphNode('node-3')
    };

    const r2 = selector({ editor: state });
    expect(r1).toBe(r2);
});
