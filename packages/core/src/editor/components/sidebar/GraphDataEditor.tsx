import React from 'react';
import Button from "../../../common/Button";
import Modal from '../../../common/Modal';
import { useToggle } from '../../../utils/hooks/useToggle';
import GraphDataExporterModal from './GraphDataEditorModal';

function GraphDataExporter() {
    const [modalShowing, toggleModal] = useToggle(false);

    return (
        <div className="ngraph-p-2 ngraph-flex-center-h">
            <Button onClick={toggleModal}>Edit JSON</Button>
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
