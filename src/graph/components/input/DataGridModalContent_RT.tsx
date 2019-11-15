import React, { useMemo } from 'react';
import { useTable, Column, useBlockLayout, useResizeColumns } from 'react-table';
import classNames from 'classnames';

type Props = {

}

const defaultColumn = {
    minWidth: 20,
    width: 150,
    // maxWidth: 500
};

export default function DataGridModalContent(props: Props): React.ReactElement {
    const columns: Column[] = useMemo(() => [
        {
            Header: 'Color',
            accessor: 'col0'
        },
        {
            Header: 'Name',
            accessor: 'col1'
        }
    ], []);

    const data: { [key: string]: unknown }[] = useMemo(() => [
        { col0: 'Red', col1: 'A' },
        { col0: 'Blue', col2: 'B' }
    ], []);

    const {
        headerGroups,
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow
    } = useTable({
        columns,
        data,
        defaultColumn
    },
        useBlockLayout,
        useResizeColumns
    );

    return (
        <div className="datagrid-modal">
            <div {...getTableProps()} className="datagrid">
                <data className="datagrid-headers">
                    {headerGroups.map((group, index) => (
                        <div key={index} {...group.getHeaderGroupProps()} className="datagrid-header-group">
                            {group.headers.map((column, index) => (
                                <div key={index} {...column.getHeaderProps()} className="datagrid-header">
                                    <div className="datagrid-header-content">
                                        {column.render('Header')}
                                    </div>
                                    <div
                                        {...(column as any).getResizerProps()}
                                        className={classNames('datagrid-resizer', { isResizing: (column as any).isResizing })}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </data>
                <div {...getTableBodyProps()} className="datagrid-body">
                    {rows.map((row, index) => {
                        prepareRow(row);
                        return (
                            <div key={index} {...row.getRowProps()} className="datagrid-row">
                                {row.cells.map((cell, index) => (
                                    <div key={index} {...cell.getCellProps()} className="datagrid-cell">
                                        {cell.render('Cell')}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

