import React, { useEffect, useMemo, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { useStore } from 'react-redux';
import { selectGraph } from '../../store/selectors';
import { GraphConfig } from '../../types/graphConfigTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { Graph } from '../../types/graphTypes';
import { StoreState } from '../../types/storeTypes';
import { graphContext, GraphContext } from '../graphEditorContext';
import GraphConnectionsContainer from './connections/GraphConnectionsContainer';
import ContextMenu from './contextmenu/ContextMenu';
import DialogsContainer from './dialog/DialogsContainer';
import { dialogsContext, DialogsManager } from './dialog/DialogsManager';
import GraphNodes from './GraphNodes';
import GraphScroller from './GraphScroller';
import Preview from './preview/Preview';
import SideBar from './sidebar/SideBar';

type Props<Ctx, P> = {
    modalRoot: HTMLElement;
    graphConfig: GraphConfig<Ctx, P>;
    params?: P;
    templates?: GraphTemplate[];
    onGraphChanged?: (graph: Graph) => void;
    renderPreview?: (graph: Graph) => React.ReactNode | null;
}

function useDialogsManager() {
    const ref = useRef<DialogsManager>();
    if (!ref.current) {
        ref.current = new DialogsManager();
    }
    return ref.current;
}

function GraphEditorInner<Ctx, P>({ modalRoot, graphConfig, params, templates, onGraphChanged, renderPreview }: Props<Ctx, P>) {
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

    // construct the graph context. Be careful that this doesn't change often, otherwise it will have
    // a large performance impact.
    const graphContextValue = useMemo((): GraphContext<Ctx, P> => {
        return {
            graphConfig,
            modalRoot,
            params: params || graphConfig.params!,
            templates: templates || [],
        };
    }, [graphConfig, templates, modalRoot, params]);

    // create the dialog manager instance
    const dialogsManager = useDialogsManager();

    return (
        <graphContext.Provider value={graphContextValue}>
            <dialogsContext.Provider value={dialogsManager}>
                <DndProvider backend={Backend}>
                    <SideBar/>
                    <GraphScroller>
                        {(scrollX, scrollY) => (
                            <>
                                <GraphConnectionsContainer
                                    scrollX={scrollX}
                                    scrollY={scrollY}
                                />
                                <GraphNodes
                                    scrollX={scrollX}
                                    scrollY={scrollY}
                                />
                            </>
                        )}
                    </GraphScroller>
                    {renderPreview
                        ? <Preview
                            renderPreview={renderPreview}/>
                        : undefined
                    }
                    <ContextMenu/>
                    <DialogsContainer/>
                </DndProvider>
            </dialogsContext.Provider>
        </graphContext.Provider>
    );
}

export default GraphEditorInner;
