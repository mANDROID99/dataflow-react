
export type Column = {
    name: string;
    key: string;
    width: number;
    editable?: boolean;
    editor?: (value: unknown, onChange: (value: unknown) => void, ref: React.RefObject<any>) => React.ReactElement | null;
    initialValue?: unknown;
    minWidth?: number;
    maxWidth?: number;
};

export type CellRenderer = (value: unknown, column: Column) => React.ReactElement | null;
