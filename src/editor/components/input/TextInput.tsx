import React, { useState, useCallback } from 'react';
import { GraphFieldInputProps } from "../../../types/graphInputTypes";

function toString(value: unknown): string {
    if (value == null) {
        return '';
    } else {
        return '' + value;
    }
}

export default function TextInput(props: GraphFieldInputProps): React.ReactElement {
    const [value, setValue] = useState(toString(props.value));

    function onBlur(): void {
        props.onChanged(value);
    }

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    return (
        <input
            className="text-input"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}
