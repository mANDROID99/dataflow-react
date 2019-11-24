import TextInput from "./TextInput"
import { GraphNodeInputSpec } from "../../types/graphSpecTypes";
import DataGridInput from "./DataGridInput";
import SelectInput from "./SelectInput";

export enum InputType {
    TEXT='text',
    SELECT='select',
    DATA_GRID='datagrid'
}

export const inputs: { [type: string]: GraphNodeInputSpec | undefined } = {
    [InputType.TEXT]: {
        component: TextInput,
        initialValue: ''
    },
    [InputType.SELECT]: {
        component: SelectInput,
        initialValue: ''
    },
    [InputType.DATA_GRID]: {
        component: DataGridInput,
        initialValue: []
    }
};
