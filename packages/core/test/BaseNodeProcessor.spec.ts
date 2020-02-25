import { BaseNodeProcessor } from '../src/nodes/BaseNodeProcessor';

class TestProcessor extends BaseNodeProcessor {
    process(portName: string, values: unknown[]): void {
        if (portName === 'portIn') {
            const v = (values as string[]).map(v => v.toUpperCase());
            super.emitResult('portOut', v);
        } else {
            throw new Error();
        }
    }
}

test('processes an input', () => {
    const receiver = {
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(1),
        onNext: jest.fn()
    };

    const processor = new TestProcessor();
    const key = processor.registerConnectionInverse('portIn');
    processor.registerConnection('portOut', 'in', receiver);
    processor.onNext('portIn', key, 'input');

    expect(receiver.registerConnectionInverse).toBeCalledTimes(1);
    expect(receiver.onNext).toBeCalledWith('in', 1, ['INPUT']);
});

test('multiple consumers', () => {
    const receiver1 = {
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(1),
        onNext: jest.fn()
    };

    const receiver2 = {
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(2),
        onNext: jest.fn()
    };

    const processor = new TestProcessor();
    const key = processor.registerConnectionInverse('portIn');
    processor.registerConnection('portOut', 'in', receiver1);
    processor.registerConnection('portOut', 'in', receiver2);
    processor.onNext('portIn', key, 'input');

    expect(receiver1.registerConnectionInverse).toBeCalledTimes(1);
    expect(receiver1.onNext).toBeCalledWith('in', 1, ['INPUT']);

    expect(receiver2.registerConnectionInverse).toBeCalledTimes(1);
    expect(receiver2.onNext).toBeCalledWith('in', 2, ['INPUT']);
});

test('multiple producers', () => {
    const receiver = {
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(1),
        onNext: jest.fn()
    };

    const processor = new TestProcessor();
    const key1 = processor.registerConnectionInverse('portIn');
    const key2 = processor.registerConnectionInverse('portIn');
    const key3 = processor.registerConnectionInverse('portIn');

    processor.registerConnection('portOut', 'in', receiver);
    processor.onNext('portIn', key1, 'a');
    processor.onNext('portIn', key2, 'b');
    processor.onNext('portIn', key3, 'c');

    expect(receiver.onNext).toBeCalledTimes(1);
    expect(receiver.onNext).toBeCalledWith('in', 1, ['A', 'B', 'C']);

    processor.onNext('portIn', key1, 'd');
    expect(receiver.onNext).toBeCalledTimes(2);
    expect(receiver.onNext).toBeCalledWith('in', 1, ['D', 'B', 'C']);

    expect(receiver.registerConnectionInverse).toBeCalledTimes(1);
});
