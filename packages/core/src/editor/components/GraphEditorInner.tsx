import React, { useMemo, useEffect } from 'react';

import { Graph } from '../../types/graphTypes';
import { GraphConfig } from '../../types/graphConfigTypes';
import { GraphPreviewParams } from '../../types/graphEditorTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { FormConfigs } from '../../types/formConfigTypes';
import { StoreState } from '../../types/storeTypes';

import ContextMenu from './contextmenu/ContextMenu';
import GraphConnections from './connections/GraphConnections';
import { forms } from '../../forms/forms';
import GraphForms from './GraphForms';
import GraphScrollContainer from './GraphScrollContainer';
import GraphHeader from '../../header/GraphHeader';
import { graphContext, GraphContext } from '../graphEditorContext';
import GraphEditorPreview from './preview/GraphEditorPreview';
import GraphEditorNodes from './GraphEditorNodes';
import { useStore } from 'react-redux';
import { selectGraph } from '../../store/selectors';

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
    
    // notify the parent when the graph changed
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

    // create the graph context object
    const graphContextValue = useMemo((): GraphContext<Ctx, P> => {
        return {
            graphConfig: props.graphConfig,
            templates: templates ?? [],
            modalRoot
        };
    }, [props.graphConfig, templates, modalRoot]);

    return (
        <graphContext.Provider value={graphContextValue}>
            <GraphHeader/>
            <GraphScrollContainer>
                <>
                    <GraphConnections/>
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
