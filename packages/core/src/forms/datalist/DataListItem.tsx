import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Action, ActionType } from './dataListFormReducer';
import CommonTextInput from '../../common/CommonTextInput';

type Props = {
    value: string;
    index: number;
    dispatch: React.Dispatch<Action>;
}

function DataListItem(props: Props) {
    const handleRemove = () => {
        props.dispatch({ type: ActionType.REMOVE_ITEM, index: props.index });
    };

    const handleChanged = (value: string) => {
        props.dispatch({ type: ActionType.CHANGE_ITEM, index: props.index, value });
    };

    return (
        <div className="ngraph-datalist-item">
            <div className="ngraph-datalist-item-index">
                <span>{props.index + '.'}</span>
            </div>
            <div className="ngraph-datalist-item-input">
                <CommonTextInput value={props.value} onChange={handleChanged}/>
            </div>
            <div className="ngraph-datalist-item-remove" onClick={handleRemove}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(DataListItem);
