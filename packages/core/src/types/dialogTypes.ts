import { ComponentType } from 'react';
import { DataGridInputValue } from "./graphInputTypes";

export enum DialogType {
    TEXT,
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
    T extends DialogType.DATA_GRID ? DataGridDialogParams :
    T extends DialogType.CONFIRM ? ConfirmDialogParams :
    never;

export type DialogResult<T extends DialogType> =
    T extends DialogType.TEXT ? string | undefined :
    T extends DialogType.DATA_GRID ? DataGridInputValue | undefined :
    T extends DialogType.CONFIRM ? boolean :
    never;
