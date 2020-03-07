import React, { useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InputProps } from '../../types/graphInputTypes';
import Button from '../../common/Button';
import { GraphNodeFieldConfig } from '../../types/graphConfigTypes';
import MultiFieldRow from './MultiFieldInputRow';
import { move } from '../../utils/arrayUtils';

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

    const handleRowMoved = useCallback((index: number, offset: number) => {
        const value = valueRef.current;
        if (!value) return;

        const vs = value.slice(0);
        const from = index;
        const to = index + offset;
        move(vs, from, to);

        for (const key in subFields) {
            if (subFields[key].lockOrder) {
                const a = vs[from] = Object.assign({}, vs[from]);
                const b = vs[to] = Object.assign({}, vs[to]);
                
                const tmp = a[key];
                a[key] = b[key];
                b[key] = tmp;
            }
        }

        onChanged(vs);
    }, [onChanged, subFields]);

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
            {value && subFields && value.map((entry, i, entries) => (
                <MultiFieldRow
                    key={i}
                    index={i}
                    isFirst={i === 0}
                    isLast={i >= entries.length - 1}
                    fieldConfigs={subFields}
                    onRemoved={handleRowRemoved}
                    onChanged={handleRowChanged}
                    onMoved={handleRowMoved}
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
