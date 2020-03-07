
export enum InputType {
    COLUMN_MAPPER = 'column-mapper',
    GRADIENT_PREVIEW = 'gradient-preview'
}

export enum ColumnMapperType {
    COLUMN='column',
    EXPRESSION='expression'
}

export type ColumnMapperInputValue = string | {
    type: ColumnMapperType.EXPRESSION;
    value: string;
}
