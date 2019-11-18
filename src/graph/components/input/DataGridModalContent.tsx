import React from 'react';
// import DataGrid, { Column } from '../datagrid/DataGrid';
import DataGrid from '../datagrid2/DataGrid';
import Button from '../common/Button';
import { Column } from '../datagrid2/dataGridTypes';

type Props = {
    onHide: () => void;
    onSave: () => void;
}

const data: string[][] = [
    ['A', 'Red'],
    ['B', 'Blue'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
    ['C', 'Green'],
];

const columns: Column[] = [
    { name: 'Name', width: 100, minWidth: 50 },
    { name: 'Colour', width: 100, minWidth: 50 }
];

export default function DataGridModalContent(props: Props): React.ReactElement {
    return (
        <div className="modal-content">
            <div className="modal-body">
                {/* <DataGrid data={data} columns={columns}/> */}
                <DataGrid data={data} columns={columns}/>
            </div>
            <div className="modal-footer">
                <Button onClick={props.onHide}>Cancel</Button>
                <Button onClick={props.onSave} primary>Save Changes</Button>
            </div>
        </div>
    );
}

