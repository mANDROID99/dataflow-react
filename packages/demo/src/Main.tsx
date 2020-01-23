import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { GraphEditor, Graph } from '@react-ngraph/core';

import { GRAPH_CONFIG } from './config/graphConfig';
import ChartPreview from './chart/ChartPreview';
import { ChartParams } from './chartContext';
import { templates } from './templates/templates';
import { store } from './store';

const PARAMS: ChartParams = {
    variables: {}
};

export default function Main() {
    const [graph, setGraph] = useState<Graph>({ nodes: {} });

    return (
        <div className="App">
            <Provider store={store}>
                <GraphEditor
                    initialGraph={graph}
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
            </Provider>
        </div>
    );
}
