import { GraphNodeFieldConfig } from "./graphConfigTypes";

export type GraphFieldEditorProps<Context, T> = {
    value: T;
    onChanged: (value: T) => void;
    field: GraphNodeFieldConfig<Context>;
    context: Context;
}
