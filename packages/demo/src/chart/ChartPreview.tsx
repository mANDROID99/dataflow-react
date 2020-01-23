import Chart from 'chart.js';
import React, { useRef, useEffect, useState } from 'react';
import {
    Graph,
    GraphConfig,
    createGraphNodeProcessors,
    findProcessorsByType,
    runProcessors
} from '@react-ngraph/core';

import { createChartConfiguration } from './createChart';
import { ChartConfig } from '../types/nodeTypes';

type Props<Ctx, Params> = {
    graph: Graph;
    graphConfig: GraphConfig<Ctx, Params>;
    params: Params;
    width: number;
    height: number;
}

export default function ChartComponent<Ctx, Params>(props: Props<Ctx, Params>) {
    const { graph, graphConfig, params, width, height } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<ChartConfig[]>();

    useEffect(() => {
        const processors = createGraphNodeProcessors(graph, graphConfig, params);
        const chartProcessors = findProcessorsByType('chart', graph, processors);
        return runProcessors(chartProcessors, (results) => {
            setData(results as ChartConfig[]);
        });
    }, [graphConfig, graph, params]);

    const chartRef = useRef<Chart>();
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && data) {
            let chart = chartRef.current;
            const config = createChartConfiguration(data[0]);

            if (chart) {
                chart.destroy();
            }
            
            chart = new Chart(canvas, config);
            chart.width = width;
            chart.height = height;
            chartRef.current = chart;
        }
    }, [data]);

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
