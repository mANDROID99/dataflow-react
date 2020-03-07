import { DialogType, DialogDefinition } from "../../../types/dialogTypes";
import TextDialog from './TextDialog';
import DataGridDialog from "./datagrid/DataGridDialog";
import ConfirmDialog from "./confirm/ConfirmDialog";

const textDialog: DialogDefinition = {
    component: TextDialog
};

const dataGridDialog: DialogDefinition = {
    component: DataGridDialog
};

const confirmDialog: DialogDefinition = {
    component: ConfirmDialog
};

const dialogs = new Map<DialogType, DialogDefinition>([
    [DialogType.TEXT, textDialog],
    [DialogType.DATA_GRID, dataGridDialog],
    [DialogType.CONFIRM, confirmDialog]
]);

export function getDialogDefinitionByType(type: DialogType): DialogDefinition | undefined {
    return dialogs.get(type);
}
