import { GraphFieldInputConfig } from "../types/graphConfigTypes";
import { InputType } from "../types/graphInputTypes";

import TextFieldInput from "./TextFieldInput";
import DataGridFieldInput from "./DataGridFieldInput";
import SelectFieldInput from "./SelectFieldInput";
import CheckFieldInput from "./CheckFieldInput";
import NumberFieldInput from "./NumberFieldInput";
import ActionsFieldInput from "./ActionsFieldInput";
import MultiFieldInput from "./multi/MultiFieldInput";
import ColorPickerInput from "./ColorPickerInput";

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
