import React from 'react';
import { SimpleTable, Column } from '@react-ngraph/core';
import { GridConfig } from '../types/gridValueTypes';

type Props = {
    gridConfig: GridConfig
}

const COLUMN_TEMPLATE: Column = {
    name: '',
    editable: true,
    width: 100,
    minWidth: 30
}

function GridPreview({ gridConfig }: Props) {
    return (
        <div className="ngraph-preview-content">
            <SimpleTable
                columnTemplate={COLUMN_TEMPLATE}
                columns={gridConfig.columns}
                rows={gridConfig.data}
                renderCell={(value) => {
                    return (
                        <div className="ngraph-table-cell-value" style={{
                            color: value.fontColor,
                            backgroundColor: value.bgColor
                        }}>
                            {value.value}
                        </div>
                    );
                }}
            />
        </div>
    )
}

export default GridPreview;
