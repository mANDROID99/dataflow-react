import { Chart } from 'chart.js';
import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import '../styles/chart.scss';
import { selectGraph } from '../../editor/selectors';
import { StoreState } from '../../types/storeTypes';
import { GraphProcessor } from '../../processor/GraphProcessor';
import { GraphConfig } from '../../types/graphConfigTypes';
import { mergeResults } from '../../processor/resultsMerger';
import { Selection, NodeValue, DataType } from '../../types/nodeProcessorTypes';

type Props = {
    graphId: string;
    graphConfig: GraphConfig;
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


export default function ChartComponent({ graphId, graphConfig, splitSize }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>();
    const graph = useSelector((state: StoreState) => selectGraph(state, graphId));

    useEffect(() => {
        if (graph) {
            const processor = GraphProcessor.create({
                resultCombiner: (results) => {
                    return mergeResults(results as NodeValue<Selection>[][], x => x.values, (left, right) => {
                        return Object.assign({}, left, right);
                    });
                },
                graph,
                graphConfig
            });

            return processor.subscribe((results) => {
                console.log(results);
            });
        }
    }, [graphConfig, graph]);

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
