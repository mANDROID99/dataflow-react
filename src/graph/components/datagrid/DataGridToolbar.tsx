import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Action, ActionType } from './DataGrid';
import Input from '../common/Input';

type Props = {
    numCols: number;
    numRows: number;
    dispatch: React.Dispatch<Action>;
}

function DataGridToolbar({ numCols, numRows, dispatch }: Props) {

    const handleRowsChanged = (value: string) => {
        dispatch({
            type: ActionType.SET_NUM_ROWS,
            count: +value
        });
    };

    const handleColsChanged = (value: string) => {
        dispatch({
            type: ActionType.SET_NUM_COLS,
            count: +value
        });
    };

    return (
        <div className="flex p-2 items-start">
            <div className="flex justify-center flex-grow">
                <div className="flex flex-col">
                    <label className="form-label">Rows</label>
                    <Input className="form-control form-control-sm text-center" type="number" value={'' + numRows} onChange={handleRowsChanged}/>
                </div>
                <div className="flex items-center px-2">
                    <FontAwesomeIcon icon="times"/>
                </div>
                <div className="flex flex-col">
                    <label className="form-label">Columns</label>
                    <Input className="form-control form-control-sm text-center" type="number" value={'' + numCols} onChange={handleColsChanged}/>
                </div>
            </div>
        </div>
    );
}

export default React.memo(DataGridToolbar);
