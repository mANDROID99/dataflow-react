
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

export function zipObjKeys<T>(xs: { [K in keyof T]: Array<T[K]> | undefined }): T[] {
    let n = 0;
    for (const k in xs) {
        const x = xs[k];
        if (!x) continue;

        const m = x.length;
        if (m > n) {
            n = m;
        }
    }

    const result: T[] = new Array(n);
    for (let i = 0; i < n; i++) {
        const obj: Partial<T> = {};

        for (const k in xs) {
            const x = xs[k];
            obj[k] = x && x.length > 0 ? x[i % x.length] : undefined;
        }

        result[i] = obj as T;
    }

    return result;
}

export function groupBy<K, T>(xs: T[], keyMapper: (value: T) => K): Map<K, T[]> {
    const groups = new Map<K, T[]>();

    for (let i = 0, n = xs.length; i < n; i++) {
        const x = xs[i];
        const k = keyMapper(x);
        
        let group: T[] | undefined = groups.get(k);
        if (!group) {
            group = [x];
            groups.set(k, group);

        } else {
            group.push(x);
        }
    }

    return groups;
}
