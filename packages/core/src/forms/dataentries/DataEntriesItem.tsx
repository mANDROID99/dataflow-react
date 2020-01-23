import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionType, Action } from './dataEntriesFormReducer';
import { Entry } from '../../types/graphFieldInputTypes';

type Props = {
    index: number;
    value: Entry<unknown>;
    dispatch: React.Dispatch<Action>;
}

function DataEntriesItem(props: Props) {
    const index = props.index;
    const value = props.value;

    const handleChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value;
        props.dispatch({ type: ActionType.SET_KEY, index, key });
    };

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        props.dispatch({ type: ActionType.SET_VALUE, index, value });
    };

    const handleRemove = () => {
        props.dispatch({ type: ActionType.REMOVE, index });
    };

    return (
        <div className="ngraph-dataentries-item">
            <div className="ngraph-dataentries-item-index">{props.index + '.'}</div>
            <div className="ngraph-dataentries-item-field">
                <input className="ngraph-input" onChange={handleChangeKey} value={value.key}/>
            </div>
            <div className="ngraph-dataentries-item-field">
                <input className="ngraph-input" onChange={handleChangeValue} value={value.value as string}/>
            </div>
            <div className="ngraph-dataentries-item-remove" onClick={handleRemove}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(DataEntriesItem);
