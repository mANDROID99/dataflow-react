
export enum AggregatorType {
    SUM = 'sum',
    COUNT = 'count',
    AVG = 'avg',
    MAX = 'max',
    MIN = 'min'
}

export interface Aggregator {
    next(value: number): void;
    result(): number;
}

export function sum(prev: number | undefined, next: number) {
    if (prev == null) {
        return next;
    } else {
        return prev + next;
    }
}

export function count(prev: number | undefined) {
    if (prev == null) {
        return 1;
    } else {
        return prev + 1;
    }
}

export function average(prev: number | undefined, next: number, n: number) {
    if (prev == null) {
        return next;
    } else {
        return prev + (next - prev) / (n + 1);
    }
}

export function max(prev: number | undefined, next: number) {
    if (prev == null) {
        return next;
    } else {
        return next > prev ? next : prev;
    }
}

export function min(prev: number | undefined, next: number) {
    if (prev == null) {
        return next;
    } else {
        return next < prev ? next : prev;
    }
}

export function createAggregator(type: AggregatorType): (prev: number | undefined, next: number, n: number) => number {
    switch (type) {
        case AggregatorType.SUM:
            return sum;
        case AggregatorType.COUNT:
            return count;
        case AggregatorType.AVG:
            return average;
        case AggregatorType.MAX:
            return max;
        case AggregatorType.MIN:
            return min;
        default:
            return count;
    }
}

