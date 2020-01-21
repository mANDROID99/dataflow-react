import React, { useRef, useState, useEffect } from 'react';

import { Graph } from '../../types/graphTypes';
import { GraphConfig } from '../../types/graphConfigTypes';
import { FormConfigs } from '../../types/formConfigTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { GraphPreviewParams } from '../../types/graphEditorTypes';
import GraphEditorInner from './GraphEditorInner';

type Props<Ctx, Params> = {
    graph?: Graph;
    graphConfig: GraphConfig<Ctx, Params>;
    params?: Params;
    forms?: FormConfigs;
    templates?: GraphTemplate[];
    renderPreview?: (params: GraphPreviewParams) => React.ReactNode | null;
    onGraphChanged?: (graph: Graph) => void;
}

export default function GraphEditor<Ctx, Params>(props: Props<Ctx, Params>) {
    const [modalRoot, setModalRoot] = useState<HTMLElement>();
    const modalRootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = modalRootRef.current;

        if (el) {
            setModalRoot(el);
        }
    }, []);

    return (
        <div className="ngraph-editor">
            {modalRoot ? <GraphEditorInner modalRoot={modalRoot} { ...props }/> : undefined}
            <div ref={modalRootRef} className="ngraph-modals"/>
        </div>
    );
}
