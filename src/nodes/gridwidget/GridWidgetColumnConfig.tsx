import React from 'react';
import { GridViewColumnConfig } from "./gridWidgetNodeDef";
import { Action, ActionType } from './reducer';
import FieldGroup from '../../components/common/form/FieldGroup';
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
        <div className="ngraph-form-list-item-content ngraph-form-row">
            <FieldGroup label="Label">
                <TextInput value={column.label} onChange={handleLabelChanged} size="md" className="ngraph-input-sm"/>
            </FieldGroup>
            <FieldGroup label="Key">
                <SelectInput value={column.key} options={columnKeys} onChange={handleKeyChanged} size="sm"/>
            </FieldGroup>
            <FieldGroup label="Width">
                <NumberInput value={column.width} onChange={handleWidthChanged} size="sm"/>
            </FieldGroup>
        </div>
    );
}

export default React.memo(ColumnConfig);
