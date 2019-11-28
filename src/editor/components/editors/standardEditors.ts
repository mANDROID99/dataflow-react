import TextEditor from "./TextEditor"
import { GraphNodeEditorConfig } from "../../../types/graphConfigTypes";
import DataGridEditor from "./DataGridEditor";
import SelectEditor from "./SelectEditor";

export enum EditorType {
    TEXT='text',
    SELECT='select',
    DATA_GRID='datagrid'
}

export const editors: { [type: string]: GraphNodeEditorConfig<any> } = {
    [EditorType.TEXT]: {
        component: TextEditor
    },
    [EditorType.SELECT]: {
        component: SelectEditor
    },
    [EditorType.DATA_GRID]: {
        component: DataGridEditor
    }
};
