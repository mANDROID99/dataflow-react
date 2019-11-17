import React, { Dispatch, useCallback } from "react";
import { Action, ActionType } from "./DataGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    dispatch: Dispatch<Action>;
}

export default function DataGridAddRow({ dispatch }: Props): React.ReactElement {

    const addRow = (): void => {
        dispatch({ type: ActionType.ADD_ROW });
    };

    return (
        <div className="datagrid-add-row" onClick={addRow}>
            <FontAwesomeIcon icon="plus"/>
        </div>
    );
}
