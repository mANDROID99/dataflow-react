import React, { useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '../../../../common/Button';
import DataListItem from './DataListItem';
import { reducer, ActionType } from './dataListDialogReducer';
import { DialogComponentProps, DataListDialogParams } from '../../../../types/dialogTypes';

export default function DataListDialog({ show, params, onResult }: DialogComponentProps<DataListDialogParams, string[] | undefined>) {
    const [values, dispatch] = useReducer(reducer, params.value || []);

    const handleCancel = () => {
        onResult(undefined);
    };

    const handleAccept = () => {
        onResult(values);
    };

    const handleAddNew = () => {
        dispatch({
            type: ActionType.ADD_ITEM,
            value: ''
        });
    };

    return (
        <div className="ngraph-modal md">
            <div className="ngraph-modal-header">Edit Items</div>
            <div className="ngraph-modal-body">
                <div className="ngraph-datalist">
                    {values.map((item, i) => (
                        <DataListItem
                            key={i}
                            value={item}
                            index={i}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
                <div className="ngraph-datalist-actions">
                    <Button onClick={handleAddNew}>
                        <span>Add</span>
                        <FontAwesomeIcon className="ngraph-btn-icon" icon="plus"/>
                    </Button>
                </div>
            </div>
            <div className="ngraph-modal-footer">
                <Button disabled={!show} variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button disabled={!show} onClick={handleAccept}>Accept</Button>
            </div>
        </div>
    );
}
