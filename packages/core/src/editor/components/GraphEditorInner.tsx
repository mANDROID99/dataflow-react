import React, { useMemo, useEffect } from 'react';
import { useStore } from 'react-redux';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { Graph } from '../../types/graphTypes';
import { GraphConfig } from '../../types/graphConfigTypes';
import { GraphPreviewParams } from '../../types/graphEditorTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { FormConfigs } from '../../types/formConfigTypes';
import { StoreState } from '../../types/storeTypes';

import ContextMenu from './contextmenu/ContextMenu';
import GraphConnectionsContainer from './connections/GraphConnectionsContainer';
import { forms as DEFAULT_FORMS } from '../../forms/forms';
import GraphForms from './GraphForms';
import GraphEditorContent from './GraphEditorContent';
import { graphContext, GraphContext } from '../graphEditorContext';
import GraphEditorPreview from './preview/GraphEditorPreview';
import GraphEditorNodes from './GraphEditorNodes';
import SideBar from './sidebar/SideBar';
import { selectGraph } from '../../store/selectors';
import { GraphNodePortRefs } from '../GraphNodePortRefs';

type Props<Ctx, P> = {
    modalRoot: HTMLElement;
    graphConfig: GraphConfig<Ctx, P>;
    params?: P;
    forms?: FormConfigs;
    templates?: GraphTemplate[];
    onGraphChanged?: (graph: Graph) => void;
    renderPreview?: (params: GraphPreviewParams) => React.ReactNode | null;
}

function GraphEditorInner<Ctx, P>({ modalRoot, graphConfig, params, forms, templates, onGraphChanged, renderPreview }: Props<Ctx, P>) {
    const formConfigs = forms ?? DEFAULT_FORMS;
    const store = useStore<StoreState>();
    
    useEffect(() => {
        if (onGraphChanged) {
            let prevGraph = selectGraph(store.getState());

            // subscribe to the store directly, to avoid
            // rendering unnecessarily
            return store.subscribe(() => {
                const state = store.getState();
                const graph = selectGraph(state);

                if (prevGraph !== graph) {
                    prevGraph = graph;
                    onGraphChanged(graph);
                }
            });
        }
    }, [store, onGraphChanged]);

    // construct the port refs instance
    const portRefs = useMemo(() => {
        return new GraphNodePortRefs();
    }, []);

    // construct the graph context. Be careful that this doesn't change often, otherwise it will have
    // a large performance impact.
    const graphContextValue = useMemo((): GraphContext<Ctx, P> => {
        return {
            graphConfig,
            modalRoot,
            ports: portRefs,
            params: params || graphConfig.params!,
            templates: templates || [],
        };
    }, [graphConfig, templates, modalRoot, portRefs, params]);

    return (
        <graphContext.Provider value={graphContextValue}>
            <DndProvider backend={Backend}>
                <SideBar/>
                <GraphEditorContent>
                    <>
                        <GraphConnectionsContainer/>
                        <GraphEditorNodes
                            graphConfig={graphConfig}
                        />
                    </>
                </GraphEditorContent>
                {renderPreview
                    ? <GraphEditorPreview
                        renderPreview={renderPreview}/>
                    : undefined
                }
                <ContextMenu/>
                <GraphForms
                    formConfigs={formConfigs}
                />
            </DndProvider>
        </graphContext.Provider>
    );
}

export default GraphEditorInner;
