import { createMemoizedCallbackSelector } from '../src/utils/createMemoizedCallbackSelector';

test('computes a value', () => {
    const selector = createMemoizedCallbackSelector<string, string>((input) => input.toUpperCase());
    expect(selector('foo')).toEqual('FOO');
    expect(selector('bar')).toEqual('BAR');
});

test('never recomputes when no dependencies provided', () => {
    const selector = createMemoizedCallbackSelector({
        compute: (input: string) => ({ input })
    });

    const a1 = selector('foo');
    const a2 = selector('foo');
    expect(a1).toBe(a2);
});

test('memoizes with dependencies', () => {
    const selector = createMemoizedCallbackSelector({
        compute: (input: string) => ({ input }),
        deps: (p) => [p]
    });

    const a1 = selector('foo');
    const a2 = selector('foo');
    expect(a1).toBe(a2);

    const b1 = selector('bar');
    expect(b1).toEqual({ input: 'bar' });
});
