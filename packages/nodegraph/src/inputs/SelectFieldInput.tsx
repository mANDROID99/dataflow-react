import React from 'react';
import { FieldInputProps } from '../types/graphFieldInputTypes';
import CommonSelectInput, { Option } from '../common/CommonSelectInput';

export default function SelectFieldInput(props: FieldInputProps<string>): React.ReactElement {
    const { value, onChanged, params } = props;
    const options = (params.options ?? []) as Option[];
    return (
        <CommonSelectInput
            value={value || ''}
            onChange={onChanged}
            options={options}
        />
    );
}
