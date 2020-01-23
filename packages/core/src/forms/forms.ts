import { FormConfig } from "../types/formConfigTypes";
import { DATA_GRID_FORM_ID, DATA_GRID_FORM } from "./datatable/DataGridForm";
import { DATA_ENTRIES_FORM_ID, DATA_ENTRIES_FORM } from "./dataentries/DataEntriesForm";
import { DATA_LIST_FORM_ID, DATA_LIST_FORM } from "./datalist/DataListForm";

export const forms: { [formType: string]: FormConfig<any> } = {
    [DATA_GRID_FORM_ID]: DATA_GRID_FORM,
    [DATA_ENTRIES_FORM_ID]: DATA_ENTRIES_FORM,
    [DATA_LIST_FORM_ID]: DATA_LIST_FORM
};
