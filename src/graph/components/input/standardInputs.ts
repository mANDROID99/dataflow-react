import TextInput from "./TextInput"
import { GraphNodeInputSpec } from "../../types/graphSpecTypes";
import DataGridInput from "./DataGridInput";

export enum InputType {
    TEXT='text',
    DATA_GRID='data-grid'
}

export const inputs: { [type: string]: GraphNodeInputSpec | undefined } = {
    [InputType.TEXT]: {
        component: TextInput
    },
    [InputType.DATA_GRID]: {
        component: DataGridInput
    }
};
