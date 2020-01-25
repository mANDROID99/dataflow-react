import Chart from 'chart.js';
import React, { useRef, useEffect, useReducer } from 'react';
import {
    Graph,
    GraphConfig,
    createGraphNodeProcessors,
    runProcessors
} from '@react-ngraph/core';

import { createChartConfiguration } from './createChart';
import { ChartContext, ChartParams } from '../chartContext';
import { chartPreviewReducer, setChartConfig, reset } from './chartPreviewReducer';

type Props = {
    graph: Graph;
    graphConfig: GraphConfig<ChartContext, ChartParams>;
    variables: { [key: string]: unknown };
    width: number;
    height: number;
}

export default function ChartPreview(props: Props) {
    const { graph, graphConfig, variables, width, height } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [state, dispatch] = useReducer(chartPreviewReducer, { charts: {} });
    const chartConfigs = state.charts;

    useEffect(() => {
        dispatch(reset());

        const params: ChartParams = {
            variables,
            renderChart(chartId, config) {
                dispatch(setChartConfig(chartId, config));
            }
        };

        const processors = createGraphNodeProcessors(graph, graphConfig, params);
        return runProcessors(processors);
    }, [graphConfig, graph, variables]);

    const chartRef = useRef<Chart>();
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let chart = chartRef.current;
        if (chart) {
            chart.destroy();
        }
        
        for (const chartId in chartConfigs) {
            const chartConfig = chartConfigs[chartId];
            const config = createChartConfiguration(chartConfig);

            chart = new Chart(canvas, config);
            chart.width = width;
            chart.height = height;
            chartRef.current = chart;

            // TODO: support multiple charts via a dropdown
            return;
        }
    }, [chartConfigs]);

    const dimsRef = useRef({ width, height });
    useEffect(() => {
        if (dimsRef.current.width !== width || dimsRef.current.height !== height) {
            dimsRef.current = { width, height };
            const chart = chartRef.current;
            
            if (chart) {
                chart.width = width;
                chart.height = height;
                chart.resize();
            }
        }
    }, [width, height]);

    return (
        <div className="chart">
            <canvas ref={canvasRef} className="chart-canvas" width={width} height={height}/>
        </div>
    );
}
