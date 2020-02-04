import React from 'react';
import { InputProps } from "../types/graphInputTypes";
import CommonTextInput from '../common/CommonTextInput';

export default function TextFieldInput(props: InputProps<string>): React.ReactElement {
    return <CommonTextInput
        value={props.value || ''}
        onChange={props.onChanged}
    />;
}
