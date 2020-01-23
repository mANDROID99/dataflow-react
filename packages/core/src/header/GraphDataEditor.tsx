import React from 'react';
import { Graph } from "../types/graphTypes";
import { useToggle } from '../utils/hooks/useToggle';
import Button from "../common/Button";
import Modal from '../common/Modal';
import GraphDataExporterModal from './GraphDataEditorModal';

type Props = {
    graph: Graph;
}

function GraphDataExporter(props: Props) {
    const [modalShowing, toggleModal] = useToggle(false);

    return (
        <div className="ngraph-header-item">
            <Button onClick={toggleModal}>Edit as JSON</Button>
            <Modal
                show={modalShowing}
                onHide={toggleModal}
            >
                <GraphDataExporterModal
                    graph={props.graph}
                    onHide={toggleModal}
                />
            </Modal>
        </div>
    );
}

export default GraphDataExporter;
