import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';
import '../styles/chart.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    graphId: string;
    splitSize: number;
}

const testData: { [key: string]: unknown }[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
    { x: 5, y: 5 }
];

function toNumber(input: unknown): number {
    if (typeof input === 'number') {
        return input;
    } else if (typeof input === 'string' || typeof input === 'boolean') {
        return +input;
    } else {
        return NaN;
    }
}

// function mapData(data: { [key: string]: unknown }[]): [number, number][] {
//     return data.map((d): [number, number] => {
//         const x: number = toNumber(d.x);
//         const y: number = toNumber(d.y);
//         return [x, y];
//     })
// }

function createChart(canvas: HTMLCanvasElement): Chart {
    return new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Data',
                    data: testData,
                    borderColor: '#2d94fb',
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        type: 'linear',
                        position: 'bottom'
                    }
                ]
            }
        }
    });
}


export default function ChartComponent({ splitSize }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) chartRef.current = createChart(canvas);
    }, []);

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) chart.resize();
    }, [splitSize]);

    return (
        <div className="chart">
            <div className="wrap-chart-canvas">
                <canvas ref={canvasRef} className="chart-canvas"/>
            </div>
            <div className="chart-footer">
                <div className="form-btn primary w-full">
                    <FontAwesomeIcon icon="play"/>
                </div>
            </div>
        </div>
    );
}
