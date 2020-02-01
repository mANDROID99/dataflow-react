import React from 'react';
import { SimpleTable, Column } from '@react-ngraph/core';
import { GridViewConfig } from '../types/valueTypes';

type Props = {
    gridConfig: GridViewConfig
}

const columnTemplate: Column = {
    name: '',
    key: '',
    editable: true,
    width: 100,
    minWidth: 30
}

function GridPreview({ gridConfig }: Props) {
    return (
        <div className="preview-content">
            <SimpleTable
                columnTemplate={columnTemplate}
                columns={gridConfig.columns}
                data={gridConfig.data}
            />
        </div>
    )
}

export default GridPreview;
