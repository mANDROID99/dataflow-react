import React from 'react';
import { SimpleTable, Column } from '@react-ngraph/common-util';
import { GridViewConfig } from '../types/valueTypes';

type Props = {
    gridConfig: GridViewConfig
}

const columnTemplate: Column = {
    name: '',
    width: 100,
    minWidth: 30
}

function GridPreview({ gridConfig }: Props) {
    return (
        <div className="preview-content">
            <SimpleTable
                columnTemplate={columnTemplate}
                columns={gridConfig.columns}
                rows={gridConfig.rows}
            />
        </div>
    )
}

export default GridPreview;
