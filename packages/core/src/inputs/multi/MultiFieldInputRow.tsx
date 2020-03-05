import React, { useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeSubFieldConfig } from '../../types/graphConfigTypes';
import MultiFieldInputValue from './MultiFieldInputValue';
import { GraphNodeActions } from '../../types/graphNodeComponentTypes';

type Props<C> = {
    index: number;
    values: { [key: string]: unknown };
    fieldConfigs: { [key: string]: GraphNodeSubFieldConfig<any, any> };
    onRemoved: (index: number) => void;
    onChanged: (index: number, values: { [key: string]: unknown }) => void;
    context: C;
    actions: GraphNodeActions;
}

function MultiFieldRow<C>({ index, values, fieldConfigs, onRemoved, onChanged, context, actions }: Props<C>) {
    const valuesRef = useRef(values);

    useEffect(() => {
        valuesRef.current = values;
    });

    const handleRemoved = () => {
        onRemoved(index);
    };

    const handleValueChanged = useCallback((key: string, value: unknown) => {
        const vs = { ...valuesRef.current};
        vs[key] = value;
        onChanged(index, vs);
    }, [index, onChanged]);

    return (
        <div className="ngraph-multifield-row">
            {Object.keys(fieldConfigs).map((fieldKey) => (
                <MultiFieldInputValue
                    key={fieldKey}
                    name={fieldKey}
                    value={values[fieldKey]}
                    fieldConfig={fieldConfigs[fieldKey]}
                    onChanged={handleValueChanged}
                    context={context}
                    actions={actions}
                />
            ))}
            <div className="ngraph-multifield-row-close" onClick={handleRemoved}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(MultiFieldRow);
