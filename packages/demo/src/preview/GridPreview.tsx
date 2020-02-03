import React from 'react';
import { SimpleTable, Column } from '@react-ngraph/core';
import { GridViewConfig } from '../types/valueTypes';

type Props = {
    gridConfig: GridViewConfig
}

const COLUMN_TEMPLATE: Column = {
    name: '',
    editable: true,
    width: 100,
    minWidth: 30
}

function GridPreview({ gridConfig }: Props) {
    return (
        <div className="preview-content">
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
