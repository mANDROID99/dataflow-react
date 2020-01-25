import { GraphFieldInputConfig } from "../types/graphConfigTypes";
import { FieldInputType } from "../types/graphFieldInputTypes";

import TextFieldInput from "./TextFieldInput";
import DataGridFieldInput from "./DataGridFieldInput";
import SelectFieldInput from "./SelectFieldInput";
import ColumnMapperFieldInput from "./ColumnMapperFieldInput";
import DataEntriesFieldInput from "./DataEntriesFieldInput";
import DataListFieldInput from "./DataListFieldInput";
import CheckFieldInput from "./CheckFieldInput";

export const inputs: { [type: string]: GraphFieldInputConfig } = {
    [FieldInputType.TEXT]: {
        component: TextFieldInput
    },
    [FieldInputType.SELECT]: {
        component: SelectFieldInput
    },
    [FieldInputType.CHECK]: {
        component: CheckFieldInput
    },
    [FieldInputType.COLUMN_MAPPER]: {
        component: ColumnMapperFieldInput
    },
    [FieldInputType.DATA_ENTRIES]: {
        component: DataEntriesFieldInput
    },
    [FieldInputType.DATA_GRID]: {
        component: DataGridFieldInput
    },
    [FieldInputType.DATA_LIST]: {
        component: DataListFieldInput
    }
};
