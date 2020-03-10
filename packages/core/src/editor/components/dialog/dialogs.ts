import { DialogDefinition, DialogType } from "../../../types/dialogTypes";
import ConfirmDialog from "./confirm/ConfirmDialog";
import DataGridDialog from "./datagrid/DataGridDialog";
import TextDialog from './TextDialog';

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
