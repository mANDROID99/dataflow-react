import { ComponentType } from 'react';
import { Entry, DataGridInputValue } from "./graphInputTypes";

export enum DialogType {
    TEXT,
    DATA_LIST,
    DATA_ENTRIES,
    DATA_GRID,
    CONFIRM
}

export type DialogComponentProps<P, R> = {
    show: boolean;
    params: P;
    onResult: (value: R) => void;
}

export type DialogDefinition = {
    component: ComponentType<DialogComponentProps<any, any>>;
}

export type TextDialogParams = {
    header: string;
    text: string;
}

export type DataListDialogParams = {
    header: string;
    value: string[] | undefined;
}

export type DataEntriesDialogParams = {
    header: string;
    value: Entry<string>[] | undefined;
}

export type DataGridDialogParams = {
    header: string;
    value: DataGridInputValue | undefined;
}

export type ConfirmDialogParams = {
    title: string;
    text: string;
}

export type DialogParams<T extends DialogType> =
    T extends DialogType.TEXT ? TextDialogParams :
    T extends DialogType.DATA_LIST ? DataListDialogParams :
    T extends DialogType.DATA_ENTRIES ? DataEntriesDialogParams :
    T extends DialogType.DATA_GRID ? DataGridDialogParams :
    T extends DialogType.CONFIRM ? ConfirmDialogParams :
    never;

export type DialogResult<T extends DialogType> =
    T extends DialogType.TEXT ? string | undefined :
    T extends DialogType.DATA_LIST ? string[] | undefined :
    T extends DialogType.DATA_ENTRIES ? Entry<string>[] | undefined :
    T extends DialogType.DATA_GRID ? DataGridInputValue | undefined :
    T extends DialogType.CONFIRM ? boolean :
    never;
