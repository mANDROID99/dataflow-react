import React from 'react';

import { useToggle } from '../utils/hooks/useToggle';
import Button from "../common/Button";
import Modal from '../common/Modal';
import GraphDataExporterModal from './GraphDataEditorModal';

function GraphDataExporter() {
    const [modalShowing, toggleModal] = useToggle(false);

    return (
        <div className="ngraph-header-item">
            <Button onClick={toggleModal}>Edit as JSON</Button>
            <Modal
                show={modalShowing}
                onHide={toggleModal}
            >
                <GraphDataExporterModal
                    onHide={toggleModal}
                />
            </Modal>
        </div>
    );
}

export default GraphDataExporter;
