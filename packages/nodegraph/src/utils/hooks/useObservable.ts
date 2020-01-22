import { useReducer, useRef, useEffect } from "react";

export interface Observable<T> {
    readonly value: T;

    addObserver(fn: (value: T) => void): void;

    removeObserver(fn: (value: T) => void): void;
}

class MutableObservable<T> implements Observable<T> {
    private readonly obs: ((value: T) => void)[] = [];
    private _value: T;

    constructor(value: T) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    setValue(v: T) {
        if (v !== this._value) {
            this._value = v;

            for (const obs of this.obs) {
                obs(v);
            }
        }
    }

    addObserver(fn: (value: T) => void): void {
        this.obs.push(fn);
    }

    removeObserver(fn: (value: T) => void): void {
        const index = this.obs.indexOf(fn);

        if (index >= 0) {
            this.obs.slice(index, 1);
        }
    }
}

export function useSelector<T, U>(obs: Observable<T>, selector: (value: T) => U, comparator?: (prev: U, next: U) => boolean): U {
    const [,forceUpdate] = useReducer((s: number) => s + 1, 0);

    const latestSelector = useRef<(value: T) => U>();
    const latestComparator = useRef<(prev: U, next: U) => boolean>();
    const latestSelected = useRef<U>();

    let selected: U;

    if (latestSelector.current !== selector) {
        selected = selector(obs.value);
    } else {
        selected = latestSelected.current!;
    }

    useEffect(() => {
        latestSelector.current = selector;
        latestSelected.current = selected;
        latestComparator.current = comparator;
    });

    useEffect(() => {
        const handle = (value: T) => {
            const selected = latestSelected.current!;
            const selector = latestSelector.current!;
            const comparator = latestComparator.current;
            const next = selector(value);

            if (selected !== next && (!comparator || !comparator(selected, next))) {
                latestSelected.current = next;
                forceUpdate(null);
            }
        };

        obs.addObserver(handle);
        return obs.removeObserver.bind(obs, handle);
    }, [obs]);

    return selected;
}

export function useObservable<T>(value: T): MutableObservable<T> {
    const ref = useRef<MutableObservable<T>>();

    if (!ref.current) {
        ref.current = new MutableObservable<T>(value);
    }

    return ref.current;
}
