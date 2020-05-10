import { useMemo } from 'react';
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

    return nodeDef.renderConfig({
        config: node.config,
        params,
        context,
        onSave,
        onHide
    }) as any;
}

