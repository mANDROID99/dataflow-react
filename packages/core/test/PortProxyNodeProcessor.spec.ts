import { ProxyPortsNodeProcessor } from '../src/nodes/ProxyPortsNodeProcessor';

const PORT_IN = 'input';
const PORT_OUT = 'output';
const PORT_OUT_INTERAL = '__out';
const PORT_IN_INTERNAL = '__in';

class TestProcessor extends ProxyPortsNodeProcessor {
    constructor() {
        super(new Map([
            [PORT_IN, PORT_OUT_INTERAL],
            [PORT_IN_INTERNAL, PORT_OUT]
        ]));
    }
}

test('call subGraphNode from input node, triggers start-node', () => {
    const proc = new TestProcessor();

    const startNode = {
        onNext: jest.fn(),
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(0)
    };

    proc.registerConnection(PORT_OUT_INTERAL, '_in', startNode);
    proc.registerConnectionInverse('', PORT_IN);

    proc.onNext(PORT_IN, 0, 'v0');
    expect(startNode.onNext).toBeCalledWith('_in', 0, 'v0');
    expect(startNode.registerConnectionInverse).toBeCalledWith(PORT_OUT_INTERAL, '_in', proc);
});

test('call subGraphNode from end-node, triggers output node', () => {
    const proc = new TestProcessor();

    const outputNode = {
        onNext: jest.fn(),
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(0)
    };

    proc.registerConnection(PORT_OUT, 'in', outputNode);
    proc.registerConnectionInverse('', PORT_IN_INTERNAL);

    proc.onNext(PORT_IN_INTERNAL, 0, 'v0');
    expect(outputNode.onNext).toBeCalledWith('in', 0, 'v0');
    expect(outputNode.registerConnectionInverse).toBeCalledWith(PORT_OUT, 'in', proc);
});

test('works when the registrations are reversed', () => {
    const proc = new TestProcessor();
    const startNode = {
        onNext: jest.fn(),
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(0)
    };

    const outputNode = {
        onNext: jest.fn(),
        registerConnection: jest.fn(),
        registerConnectionInverse: jest.fn().mockReturnValue(0)
    };

    proc.registerConnectionInverse('', PORT_IN);
    proc.registerConnection(PORT_OUT_INTERAL, '_in', startNode);

    proc.registerConnectionInverse('', PORT_IN_INTERNAL);
    proc.registerConnection(PORT_OUT, 'in', outputNode);

    proc.onNext(PORT_IN, 0, 'v0');
    expect(startNode.onNext).toBeCalledWith('_in', 0, 'v0');
    expect(startNode.registerConnectionInverse).toBeCalledWith(PORT_OUT_INTERAL, '_in', proc);

    proc.onNext(PORT_IN_INTERNAL, 0, 'v1');
    expect(outputNode.onNext).toBeCalledWith('in', 0, 'v1');
    expect(outputNode.registerConnectionInverse).toBeCalledWith(PORT_OUT, 'in', proc);
});