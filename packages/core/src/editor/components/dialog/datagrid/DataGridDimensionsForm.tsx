import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpinnerInput from '../../../../common/SpinnerInput';
import Button from '../../../../common/Button';

type Props = {
    onHide: () => void;
    onChange: (columns: string[], rows: string[][]) => void;
}

function generateColumns(n: number): string[] {
    const columns = new Array<string>(n);
    for (let i = 0; i < n; i++) {
        columns[i] = 'col-' + i;
    }
    return columns;
}

function generateRows(nCols: number, nRows: number): string[][] {
    const rows = new Array<string[]>(nRows);
    for (let i = 0; i < nRows; i++) {
        const row = new Array<string>(nCols);
        for (let j = 0; j < nCols; j++) {
            row[j] = '';
        }
        rows[i] = row;
    }
    return rows;
}

function DataGridDimensionsForm(props: Props) {
    const [dims, setDims] = useState<{ rows: number; cols: number }>({ rows: 1, cols: 1 });

    const handleRowsChanged = (rows: number) => {
        setDims({
            rows,
            cols: dims.cols
        });
    };

    const handleColsChanged = (cols: number) => {
        setDims({
            rows: dims.rows,
            cols
        });
    };

    const handleAccept = () => {
        const cols = generateColumns(dims.cols);
        const rows = generateRows(dims.cols, dims.rows);
        props.onChange(cols, rows);
    };

    return (
        <div className="ngraph-datagrid-dimensions">
            <div className="ngraph-datagrid-dimensions-form">
                <div className="ngraph-field-group">
                    <div className="ngraph-field-label">
                        Rows
                    </div>
                    <SpinnerInput value={dims.rows} onChange={handleRowsChanged} min={1} max={100} tabIndex={0}/>
                </div>
                <div className="ngraph-datagrid-dimensions-mid">
                    <FontAwesomeIcon icon="times"/>
                </div>
                <div className="ngraph-field-group">
                    <div className="ngraph-field-label">
                        Columns
                    </div>
                    <SpinnerInput value={dims.cols} onChange={handleColsChanged} min={1} max={20} tabIndex={0}/>
                </div>
            </div>
            <div className="ngraph-modal-footer">
                <Button onClick={props.onHide} variant="secondary">Cancel</Button>
                <Button onClick={handleAccept}>Accept</Button>
            </div>
        </div>
    );
}

export default DataGridDimensionsForm;
