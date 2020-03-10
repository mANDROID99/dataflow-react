import { createContext, useContext } from 'react';
import { v4 } from 'uuid';
import { DialogParams, DialogResult, DialogType } from '../../../types/dialogTypes';
import { Subscribeable } from '../../../utils/Subscribeable';

export type DialogOpts = {
    id: string;
    type: DialogType;
    params: unknown;
    onResult: (value: any) => void;
}

export class DialogsManager extends Subscribeable<DialogOpts[]> {
    private dialogs: DialogOpts[] = [];

    getDialogs(): DialogOpts[] {
        return this.dialogs;
    }

    showDialog<T extends DialogType>(dialogType: T, params: DialogParams<T>): Promise<DialogResult<T>> {
        return new Promise<DialogResult<T>>((onResult) => {
            const dialog: DialogOpts = {
                id: v4(),
                type: dialogType,
                onResult,
                params, 
            };

            const dialogs = this.dialogs.slice(0);
            this.dialogs = dialogs;
            dialogs.push(dialog);
            this.notify(dialogs);
        });
    }

    hideDialog(dialogId: string) {
        const index = this.dialogs.findIndex(d => d.id === dialogId);
        if (index < 0) return;

        const dialogs = this.dialogs.slice(0);
        this.dialogs = dialogs;
        dialogs.splice(index, 1);
        this.notify(dialogs);
    }
}

export const dialogsContext: React.Context<DialogsManager> = createContext<DialogsManager>(null!);

export function useDialogsManager() {
    return useContext(dialogsContext);
}
