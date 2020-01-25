import React, { useState } from "react";
import CommonTextInput from "../../common/CommonTextInput";
import { Action, ActionType } from "./dataGridReducer";

type Props = {
    col: number;
    row: number;
    value: string;
    dispatch: React.Dispatch<Action>;
}

function DataGridCell(props: Props) {
    const col = props.col;
    const row = props.row;
    const value = props.value;
    const dispatch = props.dispatch;

    const [editing, setEditing] = useState(false);

    const handleBeginEdit = () => {
        setEditing(true);
    };

    const handleInputChange = (value: string) => {
        setEditing(false);
        dispatch({ type: ActionType.CHANGE_CELL_VALUE, row, col, value });
    };

    return (
        <div className="ngraph-datagrid-table-cell">
            {editing
                ? (
                    <CommonTextInput
                        className="ngraph-datagrid-table-cell-input"
                        value={value}
                        onChange={handleInputChange}
                        focus
                    />
                )
                : (
                    <div
                        className="ngraph-datagrid-table-cell-value"
                        onClick={handleBeginEdit}
                        tabIndex={0}
                        onFocus={handleBeginEdit}
                    >{value || '-'}</div>
                )
            }
        </div>
    );
}

export default React.memo(DataGridCell);
