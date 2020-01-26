import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

import { ChartViewConfig } from "../types/valueTypes";
import { createChartConfiguration } from './createChart';

type Props = {
    chartConfig: ChartViewConfig;
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
        <div ref={containerRef} className="preview-content">
            <canvas ref={canvasRef} className="preview-chart-canvas"/>
        </div>
    );
}

export default ChartPreview;
