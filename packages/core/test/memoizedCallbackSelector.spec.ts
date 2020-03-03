import { createMemoizedCallbackSelector } from '../src/utils/createMemoizedCallbackSelector';

test('computes a value', () => {
    const selector = createMemoizedCallbackSelector((input: string) => input.toUpperCase());
    expect(selector('foo')).toEqual('FOO');
    expect(selector('bar')).toEqual('BAR');
});

test('memoizes with dependencies', () => {
    const selector = createMemoizedCallbackSelector({
        compute: (input) => ({ input }),
        deps: (p: string) => [p]
    });

    const a1 = selector('foo');
    const a2 = selector('foo');
    expect(a1).toBe(a2);

    const b1 = selector('bar');
    expect(b1).toEqual({ input: 'bar' });
});
