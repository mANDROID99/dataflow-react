import React from 'react';
import '../styles/chart.scss';

type Props = {
    graphId: string;
}

export default function Chart(props: Props) {
    return (
        <div className="chart">
            <div className="chart-header">
                <select>
                    <option value="pie">Pie</option>
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                </select>
            </div>
            <canvas className="chart-canvas"/>
        </div>
    );
}
