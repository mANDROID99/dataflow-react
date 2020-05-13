import React from 'react';

import { ConfigComponentProps } from "../../types/graphDefTypes";
import { BuiltInGraphParams, BuiltInGraphContext } from "../builtInNodeDefTypes";
import { Config } from "./dataGridNodeDef";
import EditableDataGrid from '../../components/common/datagrid/EditableDataGrid';

export default function DataGridConfigComponent({ config, onChanged }: ConfigComponentProps<BuiltInGraphParams, BuiltInGraphContext, Config>) {
    return (
        <EditableDataGrid
            config={config}
            setConfig={onChanged}
        />
    );
}
