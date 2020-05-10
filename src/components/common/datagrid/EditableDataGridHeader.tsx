import { HeaderRendererProps } from "react-data-grid";
import React, { useContext, useReducer, useEffect, useRef } from "react";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionType as GridActionType } from "./editableDataGridReducer";
import { gridContext } from "./context";

library.add(faEllipsisV);

type State = {
    editing: boolean;
    name: string;
}

enum ActionType {
    BEGIN_EDIT,
    END_EDIT,
    SET_BUFFERED_NAME
}

type Action =
    | { type: ActionType.BEGIN_EDIT }
    | { type: ActionType.END_EDIT }
    | { type: ActionType.SET_BUFFERED_NAME, value: string }
    ;

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.BEGIN_EDIT:
            return { ...state, editing: true };
        case ActionType.END_EDIT:
            return { ...state, editing: false };
        case ActionType.SET_BUFFERED_NAME:
            return { ...state, name: action.value };
    }
}

function init(name: string): State {
    return {
        editing: false,
        name
    };
}

export default function HeaderRenderer({ column }: HeaderRendererProps<string[]>) {
    const [state, dispatch] = useReducer(reducer, column.name, init);
    const { dispatch: gridDispatch } = useContext(gridContext);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch({ type: ActionType.SET_BUFFERED_NAME, value: column.name });
    }, [column.name]);

    useEffect(() => {
        if (state.editing && ref.current) {
            ref.current.focus();
        } 
    }, [state.editing]);

    const onStartEditing = () => {
        dispatch({ type: ActionType.BEGIN_EDIT });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: ActionType.SET_BUFFERED_NAME, value: e.target.value });
    };

    const onBlur = () => {
        if (state.editing) {
            dispatch({ type: ActionType.END_EDIT });
            const col = column.idx;
            gridDispatch({ type: GridActionType.SET_COLUMN_NAME, col, name: state.name });
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (state.editing) {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                onBlur();

            } else if (e.key === 'Escape') {
                dispatch({ type: ActionType.END_EDIT });
            }
        }
    };

    const onShowMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        const col = column.idx;
        gridDispatch({ type: GridActionType.SHOW_COLUMN_MENU, col, x: e.clientX, y: e.clientY });
    };

    return (
        <div className="ngraph-grid-header">
            <div className="ngraph-grid-column-menu" onClick={onShowMenu}>
                <FontAwesomeIcon icon={faEllipsisV}/>
            </div>
            {state.editing ? (
                <input
                    className="ngraph-grid-column-input"
                    value={state.name}
                    ref={ref}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                />
            ) : (
                <div className="ngraph-grid-column-text" onClick={onStartEditing}>
                    {column.name}
                </div>
            )}
        </div>
    );
}
