export class MultiMap<K, T> {
    private entries?: Map<K, unknown>;

    get(key: K[]): T | undefined {
        let entries = this.entries;
        if (!entries) return;

        const n = key.length;
        for (let i = 0; i < n - 1; i++) {
            entries = entries.get(key[i]) as Map<K, unknown>;
        }

        return entries.get(key[n - 1]) as T | undefined;
    }

    set(key: K[], value: T): T {
        return this.compute(key, () => value);
    }

    compute(key: K[], fn: (value: T | undefined) => T): T {
        let entries = this.entries;
        if (!entries) {
            entries = new Map<K, unknown>();
            this.entries = entries;
        }

        const n = key.length;
        for (let i = 0; i < n - 1; i++) {
            let e = entries.get(key[i]) as Map<K, unknown> | undefined;
            if (e == null) {
                e = new Map();
                entries.set(key[i], e);
            }
            entries = e;
        }

        const value = fn(entries.get(key[n - 1]) as T | undefined);
        entries.set(key[n - 1], value);
        return value;
    }
}

