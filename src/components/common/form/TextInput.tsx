import React from 'react';
import clsx from 'clsx';

type Props = {
    value: string;
    size?: string;
    className?: string;
    onChange: (value: string) => void;
}

export default function TextInput(props: Props) {
    const inputClass = props.size ? 'ngraph-input-' + props.size : undefined;
    return (
        <input
            className={clsx("ngraph-form-field-input", inputClass)}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
        />
    );
}
