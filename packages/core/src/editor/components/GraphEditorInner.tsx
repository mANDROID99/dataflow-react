import React, { useMemo, useEffect, useRef } from 'react';
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
import { forms } from '../../forms/forms';
import GraphForms from './GraphForms';
import GraphScrollContainer from './GraphScrollContainer';
import GraphHeader from '../../header/GraphHeader';
import { graphContext, GraphContext } from '../graphEditorContext';
import GraphEditorPreview from './preview/GraphEditorPreview';
import GraphEditorNodes from './GraphEditorNodes';
import SideBar from './sidebar/SideBar';
import { selectGraph } from '../../store/selectors';
import { GraphNodePortRefs } from '../GraphNodePortRefs';
import { loadGraph } from '../../store/actions';

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
    const { initialGraph, graphConfig, templates, modalRoot, renderPreview, onGraphChanged } = props;
    const formConfigs = props.forms ?? forms;
    const store = useStore<StoreState>();
    
    // load the graph into the store
    const prevGraph = useRef<Graph>();
    useEffect(() => {
        if (initialGraph && initialGraph !== prevGraph.current) {
            prevGraph.current = initialGraph;
            store.dispatch(loadGraph(initialGraph));
        }
    });

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
            <DndProvider backend={Backend}>
                <GraphHeader/>
                <div className="ngraph-editor-content">
                    <SideBar/>
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
            </div>
            </DndProvider>
        </graphContext.Provider>
    );
}

export default GraphEditorInner;
