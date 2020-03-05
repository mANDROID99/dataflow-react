import React, { useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InputProps } from '../../types/graphInputTypes';
import Button from '../../common/Button';
import { GraphNodeFieldConfig } from '../../types/graphConfigTypes';
import MultiFieldRow from './MultiFieldInputRow';

function createEntry(subFields: { [key: string]: GraphNodeFieldConfig<any, any> }) {
    const entry: { [key: string]: unknown } = {};

    for (const key in subFields) {
        entry[key] = subFields[key].initialValue;
    }

    return entry;
}

export default function MultiFieldInput({ value, onChanged, fieldConfig, context, actions }: InputProps<{ [key: string]: unknown }[]>): React.ReactElement {
    const valueRef = useRef(value);
    const subFields = fieldConfig.subFields;

    useEffect(() => {
        valueRef.current = value;
    });

    const handleRowRemoved = useCallback((index: number) => {
        const value = valueRef.current;
        if (!value) return;

        const vs = value.slice(0);
        vs.splice(index, 1);
        onChanged(vs);
    }, [onChanged]);

    const handleRowChanged = useCallback((index: number, values: { [key: string]: unknown }) => {
        const value = valueRef.current;
        if (!value) return;

        const vs = value.slice(0);
        vs[index] = values;
        onChanged(vs);
    }, [onChanged]);

    const handleCreateRow = useCallback(() => {
        const value = valueRef.current;
        if (!value || !subFields) return;

        const entry = createEntry(subFields);
        const vs = value.slice(0);
        vs.push(entry);
        onChanged(vs);
    }, [onChanged, subFields]);

    return (
        <div className="ngraph-multifield">
            {value && subFields && value.map((entry, i) => (
                <MultiFieldRow
                    key={i}
                    index={i}
                    fieldConfigs={subFields}
                    onRemoved={handleRowRemoved}
                    onChanged={handleRowChanged}
                    values={entry}
                    context={context}
                    actions={actions}
                />
            ))}
            <Button onClick={handleCreateRow}>
                <FontAwesomeIcon icon="plus"/>
            </Button>
        </div>
    );
}
