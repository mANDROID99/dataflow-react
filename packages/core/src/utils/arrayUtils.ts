export function move<T>(values: T[], from: number, to: number): void {
    const value: T = values.splice(from, 1)[0];
    values.splice(to, 0, value);
}
