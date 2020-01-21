import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldInputProps } from 'nodegraph/src/types/graphFieldInputTypes';
import { Action, ActionType } from './dataListFormReducer';

type Props<T> = {
    value: T;
    inputComponent: React.ComponentType<FieldInputProps<T>>;
    inputParams: { [key: string]: unknown };
    index: number;
    dispatch: React.Dispatch<Action>;
}

function DataListItem<T>(props: Props<T>) {
    const handleRemove = () => {
        props.dispatch({ type: ActionType.REMOVE_ITEM, index: props.index });
    };

    const handleChanged = (value: T) => {
        props.dispatch({ type: ActionType.CHANGE_ITEM, index: props.index, value });
    };

    function renderInput() {
        return React.createElement(props.inputComponent, {
            value: props.value,
            params: props.inputParams,
            onChanged: handleChanged
        });
    }

    return (
        <div className="ngraph-datalist-item">
            <div className="ngraph-datalist-item-index">
                <span>{props.index + '.'}</span>
            </div>
            <div className="ngraph-datalist-item-input">
                {renderInput()}
            </div>
            <div className="ngraph-datalist-item-remove" onClick={handleRemove}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(DataListItem);
