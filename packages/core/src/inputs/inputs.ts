import { FieldInputType, GraphFieldInputConfig, ColumnMapperType, ColumnMapperInputValue, Entry } from "../types/graphInputTypes";

import TextFieldInput from "./TextFieldInput";
import DataGridFieldInput from "./DataGridFieldInput";
import SelectFieldInput from "./SelectFieldInput";
import ColumnMapperFieldInput from "./ColumnMapperFieldInput";
import DataEntriesFieldInput from "./DataEntriesFieldInput";
import DataListFieldInput from "./DataListFieldInput";
import CheckFieldInput from "./CheckFieldInput";
import NumberFieldInput from "./NumberFieldInput";
import { compileColumnMapper, compileEntriesMapper } from "../utils/expressionUtils";

export const inputs: { [type: string]: GraphFieldInputConfig } = {
    [FieldInputType.TEXT]: {
        component: TextFieldInput,
        initialValue: ''
    },
    [FieldInputType.NUMBER]: {
        component: NumberFieldInput,
        initialValue: 0
    },
    [FieldInputType.SELECT]: {
        component: SelectFieldInput,
        initialValue: ''
    },
    [FieldInputType.CHECK]: {
        component: CheckFieldInput,
        initialValue: false
    },
    [FieldInputType.COLUMN_MAPPER]: {
        component: ColumnMapperFieldInput,
        initialValue: {
            type: ColumnMapperType.COLUMN,
            value: ''
        },
        resolveValue(cfg, params) {
            return compileColumnMapper(
                cfg as ColumnMapperInputValue,
                params.target as string | undefined
            );
        }
    },
    [FieldInputType.DATA_ENTRIES]: {
        component: DataEntriesFieldInput,
        initialValue: [],
        resolveValue(cfg, params) {
            if (!Object.prototype.hasOwnProperty.call(cfg, 'resolvable') || params.resolvable) {
                return compileEntriesMapper(cfg as Entry<string>[]);
            } else {
                return cfg;
            }
        }
    },
    [FieldInputType.DATA_GRID]: {
        component: DataGridFieldInput,
        initialValue: {
            columns: [],
            rows: []
        }
    },
    [FieldInputType.DATA_LIST]: {
        component: DataListFieldInput,
        initialValue: []
    }
};
