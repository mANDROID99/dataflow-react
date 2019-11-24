import { GraphNodeFieldSpec } from "./graphSpecTypes";

export type GraphFieldInputProps = {
    onChanged: (value: unknown) => void;
    value: unknown;
    ctx: unknown;
    fieldSpec: GraphNodeFieldSpec;
}

