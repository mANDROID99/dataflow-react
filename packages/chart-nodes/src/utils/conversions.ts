export function asString(input: any): string;
export function asString<T>(input: any, valueNotSet: T): string | T;
export function asString<T>(input: any, valueNotSet?: T): string | T {
    return input == null ? (arguments.length >= 2 ? valueNotSet! : '') : '' + input;
}

export function asNumber(input: any): number;
export function asNumber<T>(input: any, valueNotSet: T): number | T;
export function asNumber<T>(input: any, valueNotSet?: T): number | T {
    return input == null ? (arguments.length >= 2 ? valueNotSet! : 0) : +input;
}

export function asValue<T>(input: any, valueNotSet: T): string | number | T {
    if (typeof input === 'string' || typeof input === 'number') {
        return input;
    } else {
        return valueNotSet;
    }
}
