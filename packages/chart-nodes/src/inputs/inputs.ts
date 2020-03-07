import { GraphFieldInputConfig } from "@react-ngraph/core";
import { InputType } from "../types/inputTypes";
import ColumnMapperFieldInput from "./ColumnMapperFieldInput";

export const inputs: { [type: string]: GraphFieldInputConfig } = {
    [InputType.COLUMN_MAPPER]: {
        component: ColumnMapperFieldInput
    }
};
