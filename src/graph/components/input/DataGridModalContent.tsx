import React from 'react';
import DataGrid, { Column } from '../datagrid/DataGrid';

type Props = {

}

const defaultColumn = {
    minWidth: 20,
    width: 150,
    // maxWidth: 500
};

export default function DataGridModalContent(props: Props): React.ReactElement {
    const data: string[][] = [
        ['A', 'Red'],
        ['B', 'Blue']
    ];
    
    const columns: Column[] = [
        { name: 'Name', width: 100 },
        { name: 'Colour', width: 100 }
    ];

    return <DataGrid data={data} columns={columns}/>;
}

