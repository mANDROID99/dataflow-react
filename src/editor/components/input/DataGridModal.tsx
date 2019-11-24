import React from 'react';
import DataGrid from '../datagrid/DataGrid';
import { Column } from '../datagrid/dataGridTypes';

type Props = {
    data: string[][];
    columns: Column[];    
    onHide: () => void;
    onSave: (data: string[][], columns: Column[]) => void;
}

// const data: string[][] = [
//     ['A', 'Red', '0'],
//     ['B', 'Blue', '0'],
//     ['C', 'Green', '0']
// ];

// const columns: Column[] = [
//     { name: 'Name', width: 100, minWidth: 50 },
//     { name: 'Colour', width: 100, minWidth: 50 },
//     { name: 'Id', width: 100, minWidth: 50 },
// ];

export default function DataGridModal({ data, columns }: Props): React.ReactElement {
    return (
        <div className="modal-content">
            <div className="modal-body">
                <DataGrid data={data} columns={columns}/>
            </div>
            <div className="modal-footer">
                <button className="form-btn" onClick={props.onHide}>Cancel</button>
                <button className="form-btn primary ml-2" onClick={props.onSave}>Save Changes</button>
            </div>
        </div>
    );
}

