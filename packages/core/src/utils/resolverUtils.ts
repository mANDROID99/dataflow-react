
export function resolve<T, P extends any[]>(fn: T | ((...params: P) => T), ...args: P): T {
    if (typeof fn === 'function') {
        return (fn as ((...params: P) => T)).apply(null, args);
    } else {
        return fn;
    }
}
