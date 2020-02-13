import React, { useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { reducer, ActionType } from './dataEntriesDialogReducer';
import DataEntriesItem from './DataEntriesItem';
import { Entry } from '../../../../types/graphInputTypes';
import Button from '../../../../common/Button';
import { DialogComponentProps, DataEntriesDialogParams } from '../../../../types/dialogTypes';

export default function DataEntriesDialog({ show, params, onResult }: DialogComponentProps<DataEntriesDialogParams, Entry<unknown>[] | undefined>) {
    const [values, dispatch] = useReducer(reducer, params.value || []);

    const handlePushNew = () => { 
        dispatch({ type: ActionType.PUSH_NEW });
    };

    const handleCancel = () => {
        onResult(undefined);
    };

    const handleAccept = () => {
        onResult(values);
    };

    return (
        <div className="ngraph-modal md">
            <div className="ngraph-modal-header">{params.header}</div>
            <div className="ngraph-modal-body">
                <div className="ngraph-dataentries-headers">
                    <div className="ngraph-dataentries-header">Key</div>
                    <div className="ngraph-dataentries-header">Value</div>
                </div>
                <div className="ngraph-dataentries-list">
                    {values.map((value, index) => (
                        <DataEntriesItem
                            key={index}
                            index={index}
                            value={value}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
                <div className="ngraph-dataentries-actions">
                    <Button onClick={handlePushNew}>
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
