
export function resolve<T, P extends any[]>(fn: T | ((...params: P) => T), ...args: P): T {
    return typeof fn === 'function' ? (fn as ((...params: P) => T)).apply(null, args) : fn;
}

