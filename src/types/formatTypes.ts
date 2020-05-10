
export type ConditionalFormat = {
    condition: string;
    format: { [key: string]: unknown };
}

export type Format = {
    format: { [key: string]: unknown };
    conditions: ConditionalFormat[];
}
