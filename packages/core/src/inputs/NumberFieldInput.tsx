import React from 'react';
import { InputProps } from "../types/graphInputTypes";
import CommonTextInput from '../common/CommonTextInput';
import { useCallback } from 'react';

function toNumber(input: string) {
    return isNaN(input as any) ? undefined : +input;
}

export default function NumberFieldInput(props: InputProps<number>): React.ReactElement {
    const onChanged = props.onChanged;
    const min = props.params.min as number | undefined;
    const max = props.params.max as number | undefined;

    const handleChange = useCallback((input: string) => {
        let num = toNumber(input) ?? 0;

        if (min != null && num < min) {
            num = min;
        }

        if (max != null && num > max) {
            num = max;
        }

        onChanged(num);
    }, [onChanged, min, max]);

    return (
        <CommonTextInput
            value={'' + props.value}
            onChange={handleChange}
        />
    );
}
