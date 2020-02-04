import { GraphFieldInputConfig } from "../types/graphConfigTypes";
import { InputType } from "../types/graphInputTypes";

import TextFieldInput from "./TextFieldInput";
import DataGridFieldInput from "./DataGridFieldInput";
import SelectFieldInput from "./SelectFieldInput";
import ColumnMapperFieldInput from "./ColumnMapperFieldInput";
import DataEntriesFieldInput from "./DataEntriesFieldInput";
import DataListFieldInput from "./DataListFieldInput";
import CheckFieldInput from "./CheckFieldInput";
import NumberFieldInput from "./NumberFieldInput";

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
    [InputType.COLUMN_MAPPER]: {
        component: ColumnMapperFieldInput
    },
    [InputType.DATA_ENTRIES]: {
        component: DataEntriesFieldInput
    },
    [InputType.DATA_GRID]: {
        component: DataGridFieldInput
    },
    [InputType.DATA_LIST]: {
        component: DataListFieldInput
    }
};
