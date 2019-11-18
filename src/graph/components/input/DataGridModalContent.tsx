import React from 'react';
import DataGrid, { Column } from '../datagrid/DataGrid';
import Button from '../common/Button';

type Props = {
    onHide: () => void;
    onSave: () => void;
}

const data: string[][] = [
    ['A', 'Red'],
    ['B', 'Blue']
];

const columns: Column[] = [
    { name: 'Name', width: 100 },
    { name: 'Colour', width: 100 }
];

export default function DataGridModalContent(props: Props): React.ReactElement {
    return (
        <div className="ngr-modal-content">
            <div className="ngr-modal-body">
                <DataGrid data={data} columns={columns}/>
            </div>
            <div className="ngr-modal-footer">
                <Button onClick={props.onHide}>Cancel</Button>
                <Button onClick={props.onSave} primary>Save Changes</Button>
            </div>
        </div>
    );
}

