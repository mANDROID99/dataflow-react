import React, { useState } from 'react';
import { GraphEditor, Graph } from '@react-ngraph/core';

import { GRAPH_CONFIG } from './config/graphConfig';
import ChartPreview from './chart/ChartPreview';
import { ChartParams } from './chartContext';
import { templates } from './templates/templates';

const PARAMS: ChartParams = {
    variables: {}
};

export default function Main() {
    const [graph, setGraph] = useState<Graph>({ nodes: {} });

    return (
        <div className="App">
            <GraphEditor
                graph={graph}
                templates={templates}
                graphConfig={GRAPH_CONFIG}
                onGraphChanged={setGraph}
                params={PARAMS}
                renderPreview={({ graph, width, height }) => {
                    return (
                        <ChartPreview
                            graph={graph}
                            graphConfig={GRAPH_CONFIG}
                            params={PARAMS}
                            width={width}
                            height={height}
                        />
                    );
                }}
            />
        </div>
    );
}
