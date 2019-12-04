import React, { useCallback, useMemo } from 'react';
import { GraphFieldEditorProps } from "graph/types/graphConfigTypes";
import { resolve, resolveProperty } from '../editorHelpers';

type Option = string | { value: string; label: string };

function resolveOptionLabel(option: Option): string {
    return typeof option === 'string' ? option : option.label;
}

function resolveOptionValue(option: Option): string {
    return typeof option === 'string' ? option : option.value;
}

export default function SelectEditor<Ctx>({ value, onChanged, context, field }: GraphFieldEditorProps<Ctx, string>): React.ReactElement {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onChanged(e.target.value);
    }, [onChanged]);

    const options: Option[] = useMemo(() => {
        const properties = field.inputParams ? resolve(field.inputParams, context) : {};
        return resolveProperty<Option[]>(properties, 'options', []);
    }, [field, context]);

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
