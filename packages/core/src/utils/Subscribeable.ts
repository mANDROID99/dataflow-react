
export class Subscribeable<T> {
    private readonly subs: ((value: T) => void)[] = [];

    subscribe(sub: ((value: T) => void)) {
        this.subs.push(sub);
        return this.unsubscribe.bind(this, sub);
    }

    unsubscribe(sub: ((value: T) => void)) {
        const i = this.subs.indexOf(sub);
        if (i < 0) return;
        this.subs.splice(i, 1);
    }

    notify(value: T) {
        const subs = this.subs;
        if (subs.length) {
            for (const sub of subs) sub(value);
        }
    }
}
