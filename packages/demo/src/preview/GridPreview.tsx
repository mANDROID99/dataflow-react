import React from 'react';
import { useTable, useBlockLayout, Column } from 'react-table';
import { GridViewConfig, Row } from '../types/valueTypes';

type Props = {
    gridConfig: GridViewConfig
}

function extractColumns(rows: Row[]): Column[] {
    const columns: Column[] = [];
    const keys = new Set<string>();

    for (const row of rows) {
        for (const col in row) {
            if (keys.has(col)) continue;

            keys.add(col);
            columns.push({
                Header: col,
                accessor: col,
                width: 50
            });
        }
    }

    return columns;
}


function GridPreview({ gridConfig }: Props) {
    const columns = extractColumns(gridConfig.rows);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data: gridConfig.rows
        },
        useBlockLayout
    );

    return (
        <div className="preview-content">
            <div {...getTableProps()} className="table">
                <div>
                    {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map(column => (
                        <div {...column.getHeaderProps()} className="th">
                            {column.render('Header')}
                        </div>
                        ))}
                    </div>
                    ))}
                </div>

                <div {...getTableBodyProps()}>
                    {rows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (
                        <div {...row.getRowProps()} className="tr">
                            {row.cells.map(cell => {
                            return (
                                <div {...cell.getCellProps()} className="td">
                                {cell.render('Cell')}
                                </div>
                            )
                            })}
                        </div>
                        )}
                    )}
                </div>
            </div>
        </div>
    )
}

export default GridPreview;
