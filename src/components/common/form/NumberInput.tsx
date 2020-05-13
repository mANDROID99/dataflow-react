import React, { useState } from 'react';
import clsx from 'clsx';

type Props = {
    value: number;
    className?: string;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

function toNumber(input: string): number {
    if (input && !isNaN(input as any)) {
        return +input;
    } else {
        return 0;
    }
}

function roundToStep(value: number, step: number): number {
    const m = value % step;
    return value - m;
}

export default function NumberInput({ value, className, onChange, min, max, step }: Props) {
    const [input, setInput] = useState<string>('' + value);

    const handleBlur = () => {
        let v = toNumber(input);

        if (min != null && v < min) {
            v = min;
        }

        if (max != null && v > max) {
            v = max;
        }

        if (step != null) {
            v = roundToStep(v, step);
        }

        onChange(v);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <input
            className={clsx("ngr-field-input", className)}
            type="number"
            value={input}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
}

