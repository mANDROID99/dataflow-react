export function asString(input: any): string {
    return input == null ? '' : '' + input;
}

export function asNumber(input: any): number {
    return input == null ? 0 : +input;
}

export function asValue<T>(input: any, valueNotSet: T): string | number | T {
    if (typeof input === 'string' || typeof input === 'number') {
        return input;
    } else {
        return valueNotSet;
    }
}
