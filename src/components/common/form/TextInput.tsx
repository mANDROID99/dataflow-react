import React from 'react';
import clsx from 'clsx';

type Props = {
    value: string;
    className?: string;
    onChange: (value: string) => void;
}

export default function TextInput({ value, className, onChange }: Props) {
    return (
        <input
            className={clsx("ngr-field-input", className)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
