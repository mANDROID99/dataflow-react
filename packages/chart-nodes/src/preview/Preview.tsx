import React, { useEffect, useReducer, useRef } from 'react';
import { Graph, GraphConfig, createProcessorsFromGraph, runAllProcessors, invokeAllProcessors, NodeProcessor } from '@react-ngraph/core';

import { ChartContext, ChartParams } from "../types/contextTypes";
import { previewsReducer, reset, updatePreview, setActivePreview, init } from './previewsReducer';
import { ViewConfig, ViewType } from '../types/valueTypes';
import ChartPreview from './ChartPreview';
import GridPreview from './GridPreview';

type Props = {
    graph: Graph;
    graphConfig: GraphConfig<ChartContext, ChartParams>;
    params: ChartParams;
    refreshCount?: number;
}

function renderView(viewConfig: ViewConfig) {
    if (viewConfig.type === ViewType.CHART) {
        return (
            <ChartPreview
                chartConfig={viewConfig}
            />
        );

    } else {
        return (
            <GridPreview
                gridConfig={viewConfig}
            />
        );
    }
}

export default function Preview(props: Props) {
    const { graph, graphConfig, params, refreshCount } = props;
    const [state, dispatch] = useReducer(previewsReducer, null, init);

    const prevProcessors = useRef<Map<string, NodeProcessor>>();
    const prevRefreshCount = useRef<number | undefined>(refreshCount);

    useEffect(() => {
        dispatch(reset());

        const actions = { ...params.actions };
        actions.renderView = (viewId, config) => {
            dispatch(updatePreview(viewId, config));
        };

        const paramsCopy: ChartParams = { ...params, actions };
        const procs = createProcessorsFromGraph(graph, graphConfig, paramsCopy);
        prevProcessors.current = procs;

        const dispose = runAllProcessors(procs);
        invokeAllProcessors(procs);

        return dispose;
    }, [graphConfig, graph, params]);

    useEffect(() => {
        const procs = prevProcessors.current;
        if (procs && refreshCount !== prevRefreshCount.current) {
            prevRefreshCount.current = refreshCount;
            invokeAllProcessors(procs);
        }
    }, [refreshCount]);

    const handleChangeActivePreview = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setActivePreview(e.target.value));
    };

    function renderActivePreview() {
        const previewIds = Object.keys(state.previews);
        if (previewIds.length <= 1) return;

        return (
            <select className="ngraph-preview-selector" value={state.previewId || ''} onChange={handleChangeActivePreview}>
                {previewIds.map((previewId, index) => (
                    <option key={index} value={previewId}>{previewId}</option>
                ))}
            </select>
        );
    }

    return (
        <div className="ngraph-preview-container">
            {renderActivePreview()}
            {state.previewId ? renderView(state.previews[state.previewId]) : undefined}
        </div>
    )
}
