
export enum InputType {
    COLUMN_MAPPER = 'column-mapper'
}

export enum ColumnMapperType {
    COLUMN='column',
    EXPRESSION='expression'
}

export type ColumnMapperInputValue = string | {
    type: ColumnMapperType.EXPRESSION;
    value: string;
}
