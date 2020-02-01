
export type Column = {
    name: string;
    width: number;
    editable?: boolean;
    editor?: (value: unknown, onChange: (value: unknown) => void) => React.ReactElement | null;
    initialValue?: unknown;
    minWidth?: number;
    maxWidth?: number;
};

export type CellRenderer<T> = (value: T, column: Column) => React.ReactElement | null;
