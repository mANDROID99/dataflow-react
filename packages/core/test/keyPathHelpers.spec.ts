import { writeKeyPath } from '../src/editor/helpers/keyPathHelpers';

test('writes a value', () => {
    const result = {};
    writeKeyPath('a', 1, result);
    expect(result).toEqual({
        a: 1
    })
});

test('writes to an empty path', () => {
    const result = {};
    writeKeyPath('', 1, result);
    expect(result).toEqual({});
})

test('writes to a nested path', () => {
    const result = {};
    writeKeyPath('a.b', 1, result);
    writeKeyPath('a.c', 2, result);
    expect(result).toEqual({
        a: {
            b: 1,
            c: 2
        }
    });
});

test('writes to an array', () => {
    const result = {};
    writeKeyPath('a[0]', 1, result);
    writeKeyPath('a[1]', 2, result);
    expect(result).toEqual({
        a: [1, 2]
    });
});

test('writes to a nested array', () => {
    const result = {};
    writeKeyPath('xs[0][0]', 1, result);
    writeKeyPath('xs[0][1]', 2, result);
    writeKeyPath('xs[1][0]', 3, result);
    writeKeyPath('xs[1][1]', 4, result);

    expect(result).toEqual({
        xs: [
            [1, 2],
            [3, 4]
        ]
    })
});
