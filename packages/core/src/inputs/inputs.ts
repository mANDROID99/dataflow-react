import { GraphFieldInputConfig } from "../types/graphConfigTypes";
import { InputType } from "../types/graphInputTypes";
import ActionsFieldInput from "./ActionsFieldInput";
import CheckFieldInput from "./CheckFieldInput";
import ColorPickerInput from "./ColorPickerInput";
import DataGridFieldInput from "./DataGridFieldInput";
import MultiFieldInput from "./multi/MultiFieldInput";
import NumberFieldInput from "./NumberFieldInput";
import SelectFieldInput from "./SelectFieldInput";
import TextFieldInput from "./TextFieldInput";

export const inputs: { [type: string]: GraphFieldInputConfig } = {
    [InputType.TEXT]: {
        component: TextFieldInput
    },
    [InputType.NUMBER]: {
        component: NumberFieldInput
    },
    [InputType.SELECT]: {
        component: SelectFieldInput
    },
    [InputType.CHECK]: {
        component: CheckFieldInput
    },
    [InputType.DATA_GRID]: {
        component: DataGridFieldInput
    },
    [InputType.ACTIONS]: {
        component: ActionsFieldInput
    },
    [InputType.MULTI]: {
        component: MultiFieldInput
    },
    [InputType.COLOR]: {
        component: ColorPickerInput
    }
};
