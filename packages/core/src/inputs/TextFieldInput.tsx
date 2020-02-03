import React from 'react';
import { FieldInputProps } from "../types/graphInputTypes";
import CommonTextInput from '../common/CommonTextInput';

export default function TextFieldInput(props: FieldInputProps<string>): React.ReactElement {
    return <CommonTextInput
        value={props.value || ''}
        onChange={props.onChanged}
    />;
}
