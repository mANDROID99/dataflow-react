import React from 'react';
import { GridViewColumnConfig } from "./gridWidgetNodeDef";
import { Action, ActionType } from './reducer';
import TextInput from '../../components/common/form/TextInput';
import SelectInput from '../../components/common/form/SelectInput';
import NumberInput from '../../components/common/form/NumberInput';

type Props = {
    idx: number;
    column: GridViewColumnConfig;
    columnKeys: string[];
    dispatch: React.Dispatch<Action>;
}

function ColumnConfig({ idx, column, columnKeys, dispatch }: Props) {

    const handleLabelChanged = (label: string) => {
        dispatch({ type: ActionType.SET_COLUMN_LABEL, col: idx, label });
    };

    const handleKeyChanged = (key: string) => {
        dispatch({ type: ActionType.SET_COLUMN_KEY, col: idx, key });
    };

    const handleWidthChanged = (width: number) => {
        dispatch({ type: ActionType.SET_COLUMN_WIDTH, col: idx, width });
    };

    return (
        <>
            <div className="ngr-ml-2 ngr-flex-grow-2">
                <div className="ngr-field-label">Label</div>
                <TextInput
                    className="ngr-width-100"
                    value={column.label}
                    onChange={handleLabelChanged}
                />
            </div>
            <div className="ngr-mx-2 ngr-flex-grow-1">
                <div className="ngr-field-label">Key</div>
                <SelectInput
                    className="ngr-width-100"
                    value={column.key}
                    options={columnKeys}
                    onChange={handleKeyChanged}
                />
            </div>
            <div className="ngr-mr-2 ngr-flex-grow-1">
                <div className="ngr-field-label">Width</div>
                <NumberInput
                    className="ngr-width-100"
                    value={column.width}
                    onChange={handleWidthChanged}
                />
            </div>
        </>
    );
}

export default React.memo(ColumnConfig);
