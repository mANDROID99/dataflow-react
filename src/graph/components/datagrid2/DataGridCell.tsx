import React, { useState, useEffect } from 'react';
import { Action, ActionType } from "./DataGrid";

type Props = {
    col: number;
    row: number;
    value: string;
    dispatch: React.Dispatch<Action>;
}

export default function DataGridCell({ col, row, value, dispatch }: Props) {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const onBeginEditing = () => {
        setEditing(true);
    };
    
    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onInputBlur = () => {
        const value = inputValue;
        setEditing(false);
        dispatch({ type: ActionType.CHANGE_CELL_VALUE, col, row, value });
    };

    const onInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'Enter') {
                onInputBlur();
            } else {
                setEditing(false);
            }
        }
    };

    return (
        <div className="text-black bg-inherit p-2" >
            {!editing ? (
                <span className="cursor-pointer hover:underline" style={{ minWidth: 20, height: '100%' }} onClick={onBeginEditing}>{value || '-'}</span>
            ) : (
                <input
                    className="px-2 py-1 w-full"
                    value={inputValue}
                    onChange={onInputChanged}
                    onBlur={onInputBlur}
                    onKeyDown={onInputKeyPress}
                    ref={(ref) => ref?.focus()}
                />
            )}
            {/* {isAuto ? <div className="float-right"><FontAwesomeIcon icon="bars"/></div> : undefined} */}
        </div>
    );
}

