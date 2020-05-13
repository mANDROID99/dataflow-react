import React, { useMemo, useRef } from 'react';
import { useSelector } from "react-redux"
import { selectGraphNode } from "../../redux/editorSelectors";
import { useEditorContext } from "../editorContext";
import { throwUnrecognizedNodeType } from '../../utils/errors';
import { NodeProcessor } from '../../types/processorTypes';

type Props<Ctx> = {
    nodeId: string;
    processor: NodeProcessor<Ctx>;
    onSave: (config: unknown) => void;
    onHide: () => void;
}

export default function NodeConfigModalContent<Params, Ctx>({ nodeId, processor, onSave, onHide }: Props<Ctx>) {
    const { graphDef, params } = useEditorContext<Params, Ctx>();
    const node = useSelector(selectGraphNode(nodeId));

    const nodeDef = graphDef.nodes[node.type];
    if (!nodeDef) {
        throwUnrecognizedNodeType(node.type);
    }

    // select the context from the node processor.
    // Node processors are recreated every time something changed in the graph, so it will always be up to date.
    const context = useMemo(() => processor.getContext(), [processor]);
    const configRef = useRef(node.config);

    const onChanged = (config: unknown) => {
        configRef.current = config;
    };

    const onSubmit = () => {
        onSave(configRef.current);
    };

    return (
        <div className="ngr-modal ngr-modal-md">
            <div className="ngr-modal-header">
                {nodeDef.name}
            </div>
            <div className="ngr-modal-body">
                {nodeDef.renderConfig({
                    config: node.config,
                    params,
                    context,
                    onChanged
                })}
            </div>
            <div className="ngr-modal-footer">
                <button type="submit" className="ngr-btn primary ngr-mr-1" onClick={onSubmit}>
                    Apply
                </button>
                <button className="ngr-btn secondary" onClick={onHide}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
