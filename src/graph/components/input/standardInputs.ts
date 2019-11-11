import TextInput from "./TextInput"
import { GraphNodeInputSpec } from "../../types/graphSpecTypes";

export enum InputType {
    TEXT='text'
}

export const inputs: { [type: string]: GraphNodeInputSpec | undefined } = {
    [InputType.TEXT]: {
        component: TextInput
    }
};
