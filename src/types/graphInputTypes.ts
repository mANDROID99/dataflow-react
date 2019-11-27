import { GraphNodeFieldConfig } from "./graphConfigTypes";

export type GraphFieldInputProps = {
    onChanged: (value: unknown) => void;
    value: unknown;
    ctx: unknown;
    fieldSpec: GraphNodeFieldConfig;
}

