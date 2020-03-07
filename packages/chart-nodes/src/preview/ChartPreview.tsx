import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

import { ChartConfig } from "../types/chartValueTypes";
import { createChartConfiguration } from './createChart';

type Props = {
    chartConfig: ChartConfig;
}

function ChartPreview({ chartConfig }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart>();

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) {
            return;
        }

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let chart = chartInstanceRef.current;
        if (chart) {
            chart.destroy();
        }
        
        const config = createChartConfiguration(chartConfig);
        chart = new Chart(canvas, config);
        chartInstanceRef.current = chart;
    }, [chartConfig]);

    return (
        <div ref={containerRef} className="ngraph-preview-content">
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ChartPreview;
