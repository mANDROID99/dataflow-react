import React, { useState } from 'react';
import cn from 'classnames';

import DataGridDimensionsForm from './DataGridDimensionsForm';
import DataGridTable from './DataGridTable';
import { FormConfig, FormProps } from '../../types/formConfigTypes';
import { DataGridInputValue } from '../../types/graphInputTypes';

function DataGridForm(props: FormProps<DataGridInputValue>) {
    const { value, onHide, onSubmit } = props;

    // track the data state here, so that table data is only
    // changed in the graph when the "save" button on the DataGridTable is pressed,
    // not when the data dimensions are chosen.
    const [data, setData] = useState({
        columns: value.columns,
        rows: value.rows
    });

    const handleBuffChange = (columns: string[], rows: string[][]) => {
        setData({ columns, rows });
    };

    const hasData = data.columns.length > 0 && data.rows.length > 0;

    return (
        <div className={cn("ngraph-modal", { full: hasData })}>
            <div className="ngraph-modal-header">Data Grid</div>
            { hasData
                ? <DataGridTable columnNames={data.columns} rows={data.rows} onHide={onHide} onSubmit={onSubmit}/>
                : <DataGridDimensionsForm onChange={handleBuffChange} onHide={onHide}/>
            }
        </div>
    );
}

export const DATA_GRID_FORM_ID = 'data-grid';

export const DATA_GRID_FORM: FormConfig<DataGridInputValue> = {
    component: DataGridForm
};
