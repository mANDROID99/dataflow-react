import React, { useEffect, useMemo } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import store from '../redux/store';
import { Graph } from '../types/graphTypes';
import { loadGraph } from '../redux/editorActions';
import { GraphDef } from '../types/graphDefTypes';
import { editorContext, EditorContext } from './editorContext';
import { selectTheme } from '../redux/editorSelectors';
import GraphComponent from './graph/Graph';
import ThemeToggle from './ThemeToggle';
import NodeConfigModal from './configuration/NodeConfigModal';
import { createProcessorsSelector } from '../redux/editorProcessorsSelectors';

type Props<Params, Ctx> = {
    graph: Graph;
    graphDef: GraphDef<Params, Ctx>;
    params: Params;
}

function useGraphProcessors<Params, Ctx>(graphDef: GraphDef<Params, Ctx>, params: Params) {
    const selector = useMemo(() => createProcessorsSelector(graphDef, params), [graphDef, params]);
    return useSelector(selector);
}

function Editor<Params, Ctx>({ graph, graphDef, params }: Props<Params, Ctx>) {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    // update the graph in the store whenever the prop changed
    useEffect(() => {
        dispatch(loadGraph(graph));
    }, [dispatch, graph]);

    // Dn't incude the processors map in the context because it is recomputed often, whenever anything in the graph changed.
    // We don't want to cause unnecessary component renders, so it must be passed through explicitly.
    const processors = useGraphProcessors(graphDef, params);

    // construct the graph context
    const ctx = useMemo((): EditorContext<Params, Ctx> => ({
        graphDef,
        params
    }), [graphDef, params]);

    return (
        <editorContext.Provider value={ctx}>
            <div className="ngraph-editor" data-theme={theme}>
                <div className="ngraph-designer-view">
                    <GraphComponent/>
                    <NodeConfigModal
                        processors={processors}
                    />
                    <ThemeToggle/>
                </div>
            </div>
        </editorContext.Provider>
    );
}

export default function EditorConnected<Params, Ctx>(props: Props<Params, Ctx>) {
    return (
        <Provider store={store}>
            <Editor {...props}/>
        </Provider>
    );
}
