import React, { useCallback, useMemo } from 'react';
import { GraphFieldInputProps } from "../../../types/graphInputTypes";
import { resolve, resolveProperty } from '../../helpers/inputHelpers';

type Option = string | { value: string, label: string };

function resolveOptionLabel(option: Option): string {
    return typeof option === 'string' ? option : option.label;
}

function resolveOptionValue(option: Option): string {
    return typeof option === 'string' ? option : option.value;
}

export default function SelectInput({ value, onChanged, ctx, fieldSpec }: GraphFieldInputProps): React.ReactElement {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onChanged(e.target.value);
    }, []);

    const options: Option[] = useMemo(() => {
        const properties = fieldSpec.inputParams ? resolve(fieldSpec.inputParams, ctx) : {};
        return resolveProperty<Option[]>(properties, 'options', []);
    }, [fieldSpec, ctx]);

    return (
        <select
            className="select-input"
            value={value as string || ''}
            onChange={handleChange}
        >
            <option value="" disabled>-- Choose --</option>
            {options.map((option, i) => (
                <option key={i} value={resolveOptionValue(option)}>{resolveOptionLabel(option)}</option>
            ))}
        </select>
    );
}
