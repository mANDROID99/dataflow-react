import React, { useMemo, useEffect } from 'react';

import { Graph } from '../../types/graphTypes';
import { GraphConfig } from '../../types/graphConfigTypes';
import { GraphPreviewParams } from '../../types/graphEditorTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { FormConfigs } from '../../types/formConfigTypes';
import { StoreState } from '../../types/storeTypes';

import ContextMenu from './contextmenu/ContextMenu';
import GraphConnectionsContainer from './connections/GraphConnectionsContainer';
import { forms } from '../../forms/forms';
import GraphForms from './GraphForms';
import GraphScrollContainer from './GraphScrollContainer';
import GraphHeader from '../../header/GraphHeader';
import { graphContext, GraphContext } from '../graphEditorContext';
import GraphEditorPreview from './preview/GraphEditorPreview';
import GraphEditorNodes from './GraphEditorNodes';
import { useStore } from 'react-redux';
import { selectGraph } from '../../store/selectors';
import { GraphNodePortRefs } from '../GraphNodePortRefs';

type Props<Ctx, P> = {
    modalRoot: HTMLElement;
    initialGraph?: Graph;
    graphConfig: GraphConfig<Ctx, P>;
    params?: P;
    forms?: FormConfigs;
    templates?: GraphTemplate[];
    onGraphChanged?: (graph: Graph) => void;
    renderPreview?: (params: GraphPreviewParams) => React.ReactNode | null;
}

function GraphEditorInner<Ctx, P>(props: Props<Ctx, P>) {
    const { graphConfig, templates, modalRoot, renderPreview, onGraphChanged } = props;
    const formConfigs = props.forms ?? forms;
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
            graphConfig: props.graphConfig,
            templates: templates ?? [],
            modalRoot,
            ports: portRefs
        };
    }, [props.graphConfig, templates, modalRoot, portRefs]);

    return (
        <graphContext.Provider value={graphContextValue}>
            <GraphHeader/>
            <GraphScrollContainer>
                <>
                    <GraphConnectionsContainer/>
                    <GraphEditorNodes
                        graphConfig={graphConfig}
                        params={props.params}
                    />
                </>
            </GraphScrollContainer>
            {renderPreview
                ? <GraphEditorPreview
                    renderPreview={renderPreview}/>
                : undefined
            }
            <ContextMenu/>
            <GraphForms
                formConfigs={formConfigs}
            />
        </graphContext.Provider>
    );
}

export default GraphEditorInner;
