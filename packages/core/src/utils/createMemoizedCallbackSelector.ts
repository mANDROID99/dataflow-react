import { MemoizedCallback } from "../types/graphConfigTypes";

function compareDeps(prev: any[], next: any[]): boolean {
    if (prev.length !== next.length) {
        return false;
    }

    for (let i = 0, n = prev.length; i < n; i++) {
        if (prev[i] !== next[i]) {
            return false;
        }
    }

    return true;
}

export function createMemoizedCallbackSelector<P, T, D extends any[]>(config: MemoizedCallback<P, T, D>): (param: P) => T {
    let prev: T | undefined;
    let prevDeps: D[] | undefined;

    return (param: P): T => {
        if (typeof config === 'function') {
            return config(param);

        } else {
            const deps = config.deps(param);

            // return previous value if deps not changed
            if (prevDeps && compareDeps(prevDeps, deps)) {
                return prev!;
            }
            
            prevDeps = deps;
            prev = config.compute.apply(null, deps);
            return prev;
        }
    };
}
