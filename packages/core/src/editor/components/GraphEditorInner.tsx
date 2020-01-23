import React, { useMemo, useEffect, useReducer } from 'react';

import { Graph } from '../../types/graphTypes';
import { GraphConfig } from '../../types/graphConfigTypes';
import { GraphPreviewParams } from '../../types/graphEditorTypes';
import { GraphTemplate } from '../../types/graphTemplateTypes';
import { FormConfigs } from '../../types/formConfigTypes';

import { reducer, init } from '../graphReducer';
import GraphNodeComponent from './graphnode/GraphNode';
import ContextMenu from './contextmenu/ContextMenu';
import GraphConnections from './connections/GraphConnections';
import { forms } from '../../forms/forms';
import GraphForms from './GraphForms';
import { computeGraphNodeContexts } from '../../processor/computeGraphNodeContexts';
import GraphContainer from './GraphScroller';
import GraphHeader from '../../header/GraphHeader';
import { graphContext, GraphContext } from '../graphEditorContext';
import GraphEditorPreview from './preview/GraphEditorPreview';

type Props<Ctx, Params> = {
    modalRoot: HTMLElement;
    graph?: Graph;
    graphConfig: GraphConfig<Ctx, Params>;
    params?: Params;
    forms?: FormConfigs;
    templates?: GraphTemplate[];
    onGraphChanged?: (graph: Graph) => void;
    renderPreview?: (params: GraphPreviewParams) => React.ReactNode | null;
}

function GraphEditorInner<Ctx, Params>(props: Props<Ctx, Params>) {
    const [state, dispatch] = useReducer(reducer(props.graphConfig), props.graph, init);
    const { templates, modalRoot, renderPreview } = props;
    const formConfigs = props.forms ?? forms;
    
    // expose the updated graph to the parent component
    useEffect(() => {
        props.onGraphChanged?.(state.graph);
    }, [props.onGraphChanged, state.graph]);

    // compute the context for all nodes in the graph
    const nodeContexts = useMemo(() => {
        return computeGraphNodeContexts(props.params, state.graph, props.graphConfig);
    }, [props.params, state.graph, props.graphConfig]);

    // create the graph context object
    const graphContextValue = useMemo((): GraphContext<Ctx, Params> => {
        return {
            graphConfig: props.graphConfig,
            templates: templates ?? [],
            modalRoot,
            dispatch
        };
    }, [props.graphConfig, templates, modalRoot]);
    
    // compute the current template id
    const templateId = useMemo(() => {
        return templates?.find(t => t.graph === state.graph)?.id;
    }, [templates, state.graph]);

    const portDragPort = state.portDrag?.port;
    const portDragTarget = state.portDrag?.target;
    const graphNodes = state.graph.nodes;

    return (
        <graphContext.Provider value={graphContextValue}>
            <GraphHeader templateId={templateId} graph={state.graph}/>
            <GraphContainer
                scrollX={state.scrollX}
                scrollY={state.scrollY}
                dispatch={dispatch}
            >
                <>
                    <GraphConnections
                        graph={state.graph}
                        portDrag={state.portDrag}
                        ports={state.ports}
                    />
                    {(graphNodes ? Object.keys(graphNodes) : []).map(nodeId => {
                        const isSelected = state.selectedNode === nodeId;
                        const nodeContext = nodeContexts.get(nodeId)!;
                        
                        return (
                            <GraphNodeComponent
                                key={nodeId}
                                nodeId={nodeId}
                                nodeContext={nodeContext}
                                selected={isSelected}
                                graphNode={graphNodes![nodeId]}
                                portDragPort={portDragPort}
                                portDragTarget={portDragTarget}
                            />
                        );
                    })}
                </>
            </GraphContainer>
            {renderPreview
                ? <GraphEditorPreview
                    graph={state.graph}
                    renderPreview={renderPreview}/>
                : undefined
            }
            {state.contextMenu
                ? <ContextMenu contextMenu={state.contextMenu}/>
                : undefined}
            <GraphForms
                forms={state.forms}
                formConfigs={formConfigs}
            />
        </graphContext.Provider>
    );
}

export default GraphEditorInner;
