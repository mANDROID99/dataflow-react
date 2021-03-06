import React from 'react';
import CommonSelectInput, { Option } from '../common/CommonSelectInput';
import { InputProps } from '../types/graphInputTypes';

export default function SelectFieldInput(props: InputProps<string>): React.ReactElement {
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
