import { createRow, createRowGroup, createScalar, GraphNodeProcessor } from '../src/processor/processorTypes';
import { DataGridProcessor } from '../src/processor/DataGridProcessor';
import { GroupProcessor } from '../src/processor/GroupProcessor';
import { SumProcessor } from '../src/processor/SumProcessor';
import { OutputProcessor } from '../src/processor/OutputProcessor';
import { resultCollector } from '../src/processor/resultCollector';

function process<In, Out>(input: In, processor: GraphNodeProcessor<In, Out>): Promise<Out> {
    return new Promise((resolve) => {
        processor.process(input, resolve);
    });
}

test('processes a data-grid', async () => {
    const dataOut = await process({}, new DataGridProcessor('grid', ['a', 'b'], [
        ['a1', 'b1'], ['a2', 'b2']
    ]));

    expect(dataOut).toEqual({
        out: [
            createRow('0', ['grid'], { a: 'a1', b: 'b1' }),
            createRow('1', ['grid'], { a: 'a2', b: 'b2' })
        ]
    });
});

test('processes a group', async () => {
    const dataOut = await process({}, new DataGridProcessor('grid', ['a', 'b'], [
        ['a', 'a'], ['a', 'b'], ['b', 'a'], ['b', 'b']
    ]));

    const groupOut = await process({ in: dataOut.out }, new GroupProcessor('a'));
    expect(groupOut).toEqual({
        groups: [
            createRowGroup('a', ['grid'], [
                createRow('0', ['grid'], { a: 'a', b: 'a' }),
                createRow('1', ['grid'], { a: 'a', b: 'b' })
            ]),
            createRowGroup('b', ['grid'], [
                createRow('2', ['grid'], { a: 'b', b: 'a' }),
                createRow('3', ['grid'], { a: 'b', b: 'b' })
            ])
        ],
        groupNames: [
            createScalar('a', ['grid'], 'a'),
            createScalar('b', ['grid'], 'b')
        ]
    });
});

test('processes the sum of a group', async () => {
    const dataOut = await process({}, new DataGridProcessor('grid', ['a', 'b'], [
        ['a', '1'], ['a', '2'], ['b', '3'], ['b', '4']
    ]));

    const groupOut = await process({ in: dataOut.out }, new GroupProcessor('a'));
    const sumOut = await process({ in: groupOut.groups }, new SumProcessor('b'));
    expect(sumOut).toEqual({
        out: [
            createScalar('a', ['grid'], 3),
            createScalar('b', ['grid'] , 7)
        ]
    });
});

test('processes multiple groups', async () => {
    const dataOut = await process({}, new DataGridProcessor('grid', ['a', 'b', 'c'], [
        ['a', 'a', '1'], ['a', 'b', '2'], ['b', 'a', '3'], ['b', 'b', '4']
    ]));

    const groupAOut = await process({ in: dataOut.out }, new GroupProcessor('a'));
    const groupBOut = await process({ in: groupAOut.groups }, new GroupProcessor('b'));
    const sumOut = await process({ in: groupBOut.groups }, new SumProcessor('c'));

    expect(sumOut).toEqual({
        out: [
            createScalar('a', ['grid', 'a'],  1),
            createScalar('b', ['grid', 'a'], 2),
            createScalar('a', ['grid', 'b'], 3),
            createScalar('b', ['grid', 'b'], 4)
        ]
    });
});

test('collects results', async () => {
    const dataOut = await process({}, new DataGridProcessor('grid', ['a', 'b'], [
        ['a', '1'], ['a', '2'], ['b', '3'], ['b', '4']
    ]));

    const groupOut = await process({ in: dataOut.out }, new GroupProcessor('a'));
    const sumOut = await process({ in: groupOut.groups }, new SumProcessor('b'));
    const out1 = await process({ in: groupOut.groupNames }, new OutputProcessor('group'));
    const out2 = await process({ in: sumOut.out }, new OutputProcessor('value'));

    const results = out1.out.concat(out2.out);
    expect(resultCollector(results)).toEqual([
        { group: 'a', value: 3 },
        { group: 'b', value: 7 }
    ]);
});
