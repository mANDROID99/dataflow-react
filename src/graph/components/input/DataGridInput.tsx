import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faEdit);

import { GraphFieldInputProps } from "../../types/graphInputTypes";
import Modal from '../common/Modal';


export default function DataGridInput(props: GraphFieldInputProps): React.ReactElement {
    const [modalShowing, setModalShowing] = useState(false);

    const showModal = useCallback(() => {
        setModalShowing(true);
    }, []);

    const hideModal = useCallback(() => {
        setModalShowing(false);
    }, []);

    return (
        <button className="rounded bg-light px-2 py-1 hover:bg-primary hover:text-white" onClick={showModal}>
            <span className="select-none">Edit</span>
            <FontAwesomeIcon className="ml-2" icon="edit"/>
            <Modal show={modalShowing} onHide={hideModal}/>
        </button>
    );
}
