import { DialogType, DialogDefinition } from "../../../types/dialogTypes";
import TextDialog from './TextDialog';
import DataEntriesDialog from './dataentries/DataEntriesDialog';
import DataListDialog from "./datalist/DataListDialog";
import DataGridDialog from "./datagrid/DataGridDialog";

const textDialog: DialogDefinition = {
    component: TextDialog
};

const dataListDialog: DialogDefinition = {
    component: DataListDialog
};

const dataEntriesDialog: DialogDefinition = {
    component: DataEntriesDialog
};

const dataGridDialog: DialogDefinition = {
    component: DataGridDialog
};

const dialogs = new Map<DialogType, DialogDefinition>([
    [DialogType.TEXT, textDialog],
    [DialogType.DATA_LIST, dataListDialog],
    [DialogType.DATA_ENTRIES, dataEntriesDialog],
    [DialogType.DATA_GRID, dataGridDialog]
]);

export function getDialogDefinitionByType(type: DialogType): DialogDefinition | undefined {
    return dialogs.get(type);
}
