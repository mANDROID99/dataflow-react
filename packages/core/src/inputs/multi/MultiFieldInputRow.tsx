import React, { useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeSubFieldConfig } from '../../types/graphConfigTypes';
import { GraphNodeActions } from '../../types/graphNodeComponentTypes';
import GraphNodeFieldInput from '../../editor/components/graphnode/GraphNodeFieldInput';

type Props<C> = {
    index: number;
    isFirst: boolean;
    isLast: boolean;
    values: { [key: string]: unknown };
    fieldConfigs: { [key: string]: GraphNodeSubFieldConfig<any, any> };
    onRemoved: (index: number) => void;
    onMoved: (index: number, offset: number) => void;
    onChanged: (index: number, values: { [key: string]: unknown }) => void;
    context: C;
    actions: GraphNodeActions;
}

function MultiFieldRow<C>({ index, isFirst, isLast, values, fieldConfigs, onRemoved, onMoved, onChanged, context, actions }: Props<C>) {
    const valuesRef = useRef(values);

    useEffect(() => {
        valuesRef.current = values;
    });

    const handleRemoved = () => {
        onRemoved(index);
    };

    const handleMoveUp = () => {
        onMoved(index, -1);
    };

    const handleMoveDown = () => {
        onMoved(index, 1);
    };

    const handleValueChanged = useCallback((key: string, value: unknown) => {
        const vs = { ...valuesRef.current};
        vs[key] = value;
        onChanged(index, vs);
    }, [index, onChanged]);

    return (
        <div className="ngraph-multifield-row">
            <div className="ngraph-multifield-row-move">
                {!isFirst && <div className="ngraph-multifield-row-btn" onClick={handleMoveUp}>
                    <FontAwesomeIcon icon="chevron-up"/>
                </div>}
                {!isLast && <div className="ngraph-multifield-row-btn" onClick={handleMoveDown}>
                    <FontAwesomeIcon icon="chevron-down"/>
                </div>}
            </div>
            {Object.keys(fieldConfigs).map((fieldKey) => (
                    <div
                        key={fieldKey}
                        className="ngraph-multifield-input"
                    >
                        <GraphNodeFieldInput
                            fieldName={fieldKey}
                            fieldValue={values[fieldKey]}
                            fieldValues={values}
                            fieldConfig={fieldConfigs[fieldKey]}
                            onChanged={handleValueChanged}
                            context={context}
                            actions={actions}
                        />
                    </div>
                ))}
            <div className="ngraph-multifield-row-btn" onClick={handleRemoved}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(MultiFieldRow);
