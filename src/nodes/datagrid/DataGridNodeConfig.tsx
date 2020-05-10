import React, { useRef } from 'react';

import { ConfigComponentProps } from "../../types/graphDefTypes";
import { BuiltInGraphParams, BuiltInGraphContext } from "../builtInNodeDefTypes";
import { Config } from "./dataGridNodeDef";
import EditableDataGrid from '../../components/common/datagrid/EditableDataGrid';
import Button from '../../components/common/Button';

export default function DataGridConfigComponent({ config, onSave, onHide }: ConfigComponentProps<BuiltInGraphParams, BuiltInGraphContext, Config>) {
    const configRef = useRef(config);

    return (
        <>
            <div className="ngraph-modal-body">
                <EditableDataGrid
                    config={config}
                    setConfig={(config) => configRef.current = config}
                />
            </div>
            <div className="ngraph-modal-footer">
                <Button variant="secondary" onClick={onHide} label="Cancel"/>
                <Button variant="primary" onClick={() => onSave(configRef.current)} label="Apply Changes"/>
            </div>
        </>
    );
}
