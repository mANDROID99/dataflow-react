export enum DialogType {
    TEXT
}

export type TextDialogParams = {
    header: string;
    text: string;
}

export type DialogParams<T extends DialogType> =
    T extends DialogType.TEXT ? TextDialogParams
    : never;

export type DialogResult<T extends DialogType> =
    T extends DialogType.TEXT ? string | undefined
    : never;
