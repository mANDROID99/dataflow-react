import React from 'react';
import { Action } from './editableDataGridReducer';

export type EditableGridContext = {
    dispatch: React.Dispatch<Action>;
}

export const gridContext = React.createContext<EditableGridContext>(null!);
