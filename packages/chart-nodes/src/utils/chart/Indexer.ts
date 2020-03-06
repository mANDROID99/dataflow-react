export class Indexer {
    private readonly lookup = new Map<string, number>();
    private readonly keys: string[] = [];
    private c: number = 0;

    next(key: string): number {
        let i = this.lookup.get(key);

        if (i == null) {
            i = this.c++;
            this.lookup.set(key, i);
            this.keys.push(key);
        }

        return i;
    }

    getKeys(): string[] {
        return this.keys;
    }
}
