import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphFieldInputProps } from "../../types/graphInputTypes";
import Modal from '../common/Modal';
import DataGridModalContent from './DataGridModal';


export default function DataGridInput({ value, onChanged }: GraphFieldInputProps): React.ReactElement {
    const [modalShowing, setModalShowing] = useState(false);

    const showModal = useCallback(() => {
        setModalShowing(true);
    }, []);

    const hideModal = useCallback(() => {
        setModalShowing(false);
    }, []);

    return (
        <div className="relative">
            <div className="form-btn" onClick={showModal}>
                <span>Edit</span>
                <FontAwesomeIcon className="ml-2" icon="edit"/>
            </div>
            <Modal show={modalShowing} onHide={hideModal}>
                <DataGridModalContent onHide={hideModal} onSave={hideModal}/>
            </Modal>
        </div>
    );
}
