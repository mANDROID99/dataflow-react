import React, { useEffect } from "react";

export type Option = string | { value: string; label: string };

type Props = {
    value: string;
    options: Option[];
    optional?: boolean;
    onChange: (value: string) => void;
}

function resolveOptionLabel(option: Option): string {
    return typeof option === 'string' ? option : option.label;
}

function resolveOptionValue(option: Option): string {
    return typeof option === 'string' ? option : option.value;
}

function CommonSelectInput(props: Props) {
    const { value, options, onChange } = props;

    useEffect(() => {
        if (options.length > 0 && !options.some(opt => resolveOptionValue(opt) === value)) {
            // choose a different option if input is not a valid option
            onChange(resolveOptionValue(options[0]));
        }
    }, [value, options, onChange]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <select
            className="ngraph-input"
            value={value as string || ''}
            onChange={handleChange}
        >
            {options.map((option, i) => (
                <option key={i} value={resolveOptionValue(option)}>{resolveOptionLabel(option)}</option>
            ))}
        </select>
    );
}

export default CommonSelectInput;
