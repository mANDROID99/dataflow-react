
export function pushDistinct<T>(xs: T[], value: T) {
    if (xs.indexOf(value) < 0) {
        xs = xs.slice(0);
        xs.push(value);
        return xs;

    } else {
        return xs;
    }
}

export function mergeDistinct<T>(xs: T[], ys: T[]): T[] {
    const seen = new Set<T>();
    const result = new Array<T>(xs.length);

    for (let i = 0, n = xs.length; i < n; i++) {
        result[i] = xs[i];
        seen.add(xs[i]);
    }

    for (let i = 0, n = ys.length; i < n; i++) {
        const value = ys[i];
        if (!seen.has(value)) {
            result.push(value);
        }
    }

    return result;
}
