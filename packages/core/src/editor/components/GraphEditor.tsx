import React, { useRef, useState, useEffect } from 'react';
import { Provider } from 'react-redux';

import { Graph } from '../../types/graphTypes';
import { GraphConfig } from '../../types/graphConfigTypes';
import { FormConfigs } from '../../types/formConfigTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { GraphPreviewParams } from '../../types/graphEditorTypes';
import { initStore } from '../../store/store';
import GraphEditorInner from './GraphEditorInner';
import { loadGraph } from '../../store/actions';

type Props<Ctx, Params> = {
    initialGraph?: Graph;
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
    const [storeInstance] = useState(initStore);

    // track reference to the DOM node to use as the modal root
    useEffect(() => {
        const el = modalRootRef.current;
        if (el) {
            setModalRoot(el);
        }
    }, []);

    // load the initial graph into the store
    const prevGraph = useRef<Graph>();
    useEffect(() => {
        if (props.initialGraph && props.initialGraph !== prevGraph.current) {
            prevGraph.current = props.initialGraph;
            storeInstance.dispatch(loadGraph(props.initialGraph));
        }
    });

    return (
        <Provider store={storeInstance}>
            <div className="ngraph-editor">
                {modalRoot ? <GraphEditorInner modalRoot={modalRoot} { ...props }/> : undefined}
                <div ref={modalRootRef} className="ngraph-modals"/>
            </div>
        </Provider>
    );
}
