import React from 'react';
import CommonTextInput from '../common/CommonTextInput';
import { InputProps } from "../types/graphInputTypes";

export default function TextFieldInput(props: InputProps<string>): React.ReactElement {
    return <CommonTextInput
        value={props.value || ''}
        onChange={props.onChanged}
    />;
}
