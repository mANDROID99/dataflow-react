import React, { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphFieldEditorProps } from "../../../types/graphEditorTypes";
import Modal from '../common/Modal';
import DataGrid from '../datagrid/DataGrid';
import { Column } from '../datagrid/dataGridTypes';

export type DataGridValue = {
    columns: Column[];
    rows: string[][];
}

export function emptyDataGrid(): DataGridValue {
    return {
        columns: [],
        rows: []
    };
}

export default function DataGridEditor({ value, onChanged }: GraphFieldEditorProps<DataGridValue>): React.ReactElement {
    const [modalShowing, setModalShowing] = useState(false);
    const data = value as DataGridValue;

    const showModal = useCallback(() => {
        setModalShowing(true);
    }, []);

    const hideModal = useCallback(() => {
        setModalShowing(false);
    }, []);

    const onSaveGridData = useCallback((columns: Column[], rows: string[][]) => {
        const value: DataGridValue = { columns, rows };
        onChanged(value);
        setModalShowing(false);
    }, []);

    return (
        <>
            <div className="form-btn" onClick={showModal}>
                <span>Edit</span>
                <FontAwesomeIcon className="ml-2" icon="edit"/>
            </div>
            <Modal show={modalShowing} onHide={hideModal}>
                <DataGrid
                    columns={data.columns}
                    rows={data.rows}
                    onHide={hideModal}
                    onSave={onSaveGridData}
                />
            </Modal>
        </>
    );
}
