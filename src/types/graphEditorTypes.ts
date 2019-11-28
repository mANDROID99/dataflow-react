import { GraphNodeFieldConfig } from "./graphConfigTypes";

export type GraphFieldEditorProps<T> = {
    value: T;
    onChanged: (value: T) => void;
    field: GraphNodeFieldConfig<T>;
    ctx: unknown;
}
