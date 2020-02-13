
export function invokeAll<P extends any[]>(...fns: ((...args: P) => void)[]) {
    return (...args: P) => {
        for (const fn of fns) {
            fn(...args);
        }
    };
}
