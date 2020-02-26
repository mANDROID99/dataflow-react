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

export function createMemoizedCallbackSelector<P, T, D>(config: MemoizedCallback<P, T, D>): (param: P) => T {
    let prev: T | undefined;
    let prevDeps: D[] | undefined;

    return (param: P): T => {
        if (typeof config === 'function') {
            return config(param);

        } else {
            let deps: D[];

            if (config.deps) {
                deps = config.deps(param);
            } else {
                // NEVER recompute when no deps callback provided
                deps = [];
            }

            // return previous value if deps not changed
            if (prevDeps && compareDeps(prevDeps, deps)) {
                return prev!;
            }
            
            prevDeps = deps;
            return prev = config.compute(param, deps);
        }
    };
}
