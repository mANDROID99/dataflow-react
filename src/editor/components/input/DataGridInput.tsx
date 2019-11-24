import React, { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphFieldInputProps } from "../../types/graphInputTypes";
import Modal from '../common/Modal';
import DataGrid from '../datagrid/DataGrid';
import { Column } from '../datagrid/dataGridTypes';

export type DataGridInputValue = {
    columns: Column[];
    rows: string[][];
}

export default function DataGridInput({ value, onChanged }: GraphFieldInputProps): React.ReactElement {
    const [modalShowing, setModalShowing] = useState(false);
    const data = value as DataGridInputValue;

    const showModal = useCallback(() => {
        setModalShowing(true);
    }, []);

    const hideModal = useCallback(() => {
        setModalShowing(false);
    }, []);

    const onSaveGridData = useCallback((columns: Column[], rows: string[][]) => {
        const value: DataGridInputValue = { columns, rows };
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
