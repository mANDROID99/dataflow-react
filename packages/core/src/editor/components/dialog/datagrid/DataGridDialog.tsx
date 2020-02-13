import React, { useState } from 'react';
import cn from 'classnames';

import { DataGridInputValue } from '../../../../types/graphInputTypes';
import { DialogComponentProps, DataGridDialogParams } from '../../../../types/dialogTypes';
import DataGridDimensionsForm from './DataGridDimensionsForm';
import DataGridTable from './DataGridTable';

export default function DataGridDialog({ params, onResult }: DialogComponentProps<DataGridDialogParams, DataGridInputValue | undefined>) {

    // track the data state here, so that table data is only
    // changed in the graph when the "save" button on the DataGridTable is pressed
    const [data, setData] = useState({
        columns: params.value?.columns ?? [],
        rows: params.value?.rows ?? []
    });

    const handleBuffChange = (columns: string[], rows: string[][]) => {
        setData({ columns, rows });
    };

    const handleCancel = () => {
        onResult(undefined);
    };

    const handleAccept = (value: DataGridInputValue) => {
        onResult(value);
    };

    const hasData = data.columns.length > 0 && data.rows.length > 0;

    return (
        <div className={cn("ngraph-modal", { full: hasData })}>
            <div className="ngraph-modal-header">Data Grid</div>
            { hasData
                ? <DataGridTable columnNames={data.columns} rows={data.rows} onHide={handleCancel} onSubmit={handleAccept}/>
                : <DataGridDimensionsForm onChange={handleBuffChange} onHide={handleCancel}/>
            }
        </div>
    );
}
