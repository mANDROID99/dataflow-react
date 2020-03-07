import { GraphFieldInputConfig } from "@react-ngraph/core";
import { InputType } from "../types/inputTypes";
import ColumnMapperFieldInput from "./ColumnMapperFieldInput";
import GradientPreviewFieldInput from "./GradientPreviewFieldInput";

export const inputs: { [type: string]: GraphFieldInputConfig } = {
    [InputType.COLUMN_MAPPER]: {
        component: ColumnMapperFieldInput
    },
    [InputType.GRADIENT_PREVIEW]: {
        component: GradientPreviewFieldInput
    }
};
