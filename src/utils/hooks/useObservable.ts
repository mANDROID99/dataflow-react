import { useEffect, useReducer, useRef, useState } from "react"

export interface Observable<T> {
    value: T;
    subscribe(fn: (value: T) => void): () => void;
}

export class Value$<T> {
    private subs: ((value: T) => void)[] | undefined;
    private _value: T;

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    set(value: T) {
        this._value = value;
        const subs = this.subs;
        if (subs && subs.length) {
            for (const sub of subs) sub(value);
        }
    }

    subscribe(sub: (value: T) => void): () => void {
        if (!this.subs) {
            this.subs = [];
        } 
        
        const subs = this.subs;
        subs.push(sub);

        return () => {
            const i = subs.indexOf(sub);
            if (i >= 0) subs.splice(i, 1);
        }
    }
}

export class Reducer$<S, A> extends Value$<S> {
    private reducer: (value: S, action: A) => S;

    constructor(value: S, reducer: (value: S, action: A) => S) {
        super(value);
        this.reducer = reducer;
    }

    setReducer(reducer: (value: S, action: A) => S) {
        this.reducer = reducer;
    }

    dispatch(action: A): void {
        this.set(this.reducer(this.value, action));
    }
}

export function useSelector$<T, U>(obs: Observable<T>, selector: (value: T) => U, eq?: (prev: U, next: U) => boolean): U {
    const [value, dispatch] = useReducer((prev: U, next: T) => {
        const s = selector(next);
        if (s === prev || (eq && eq(prev, s))) {
            return prev;
        }
        return s;
    }, obs.value, selector);
    
    useEffect(() => {
        return obs.subscribe(dispatch);
    }, [obs]);

    return value;
}

export function useLatest$<T>(obs: Observable<T>): T {
    const [value, setValue] = useState(obs.value);

    useEffect(() => {
        return obs.subscribe(setValue);
    }, [obs]);

    return value;
}

export function useReducer$<S, A>(reducer: (state: S, action: A) => S, initialState: S): Reducer$<S, A>;
export function useReducer$<S, A, I>(reducer: (state: S, action: A) => S, initialValue: I, creator: (value: I) => S): Reducer$<S, A>;
export function useReducer$<S, A, I>(reducer: (state: S, action: A) => S, initialValueOrState: S | I, creator?: (value: I) => S): Reducer$<S, A> {
    const ref = useRef<Reducer$<S, A>>();
    if (!ref.current) {
        const initialState: S = creator ? creator(initialValueOrState as I) : initialValueOrState as S;
        ref.current = new Reducer$(initialState, reducer);
    }

    useEffect(() => {
        ref.current!.setReducer(reducer);
    });

    return ref.current;
}

export function useValue$<T>(initialValue: T): Value$<T> {
    const ref = useRef<Value$<T>>();
    if (!ref.current) {
        ref.current = new Value$(initialValue);
    }
    return ref.current;
}
