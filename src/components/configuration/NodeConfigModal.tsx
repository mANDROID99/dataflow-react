import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cancelConfigModal, setNodeConfig } from '../../redux/editorActions';
import { selectConfiguringNode } from '../../redux/editorSelectors';
import { NodeProcessor } from '../../types/processorTypes';
import { throwNodeNotFound } from '../../utils/errors';
import { ActionType, useModalReducer } from '../../utils/modalReducer';
import Modal from '../common/Modal';
import NodeConfigModalContent from './NodeConfigModalContent';

type Props<Ctx> = {
    processors: Map<string, NodeProcessor<Ctx>>;
}

function NodeConfigModal<Ctx>({ processors }: Props<Ctx>) {
    const reduxDispatch = useDispatch();
    const nodeId = useSelector(selectConfiguringNode);
    const [state, dispatch] = useModalReducer<string>();

    useEffect(() => {
        if (nodeId) {
            dispatch({ type: ActionType.SHOW, value: nodeId });
        } else {
            dispatch({ type: ActionType.HIDE });
        }
    }, [nodeId, dispatch]);

    if (!state.value || state.exit) {
        return null;
    }

    const processor = processors.get(state.value);
    if (!processor) {
        throwNodeNotFound(state.value);
    }

    return (
        <Modal
            title="Node Config"
            show={state.show}
            onExit={() => dispatch({ type: ActionType.EXIT })}
            onHide={() => reduxDispatch(cancelConfigModal())}
        >
            <NodeConfigModalContent
                nodeId={state.value}
                processor={processor}
                onSave={(config) => reduxDispatch(setNodeConfig(state.value!, config, true))}
                onHide={() => reduxDispatch(cancelConfigModal())}
            />
        </Modal>
    )
}

export default NodeConfigModal;
