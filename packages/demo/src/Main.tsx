import React from 'react';
import { Provider } from 'react-redux';
import { GraphEditor } from '@react-ngraph/core';

import { GRAPH_CONFIG } from './config/graphConfig';
import ChartPreview from './chart/ChartPreview';
import { ChartParams } from './chartContext';
import { templates } from './templates/templates';
import { store } from './store';

const PARAMS: ChartParams = {
    variables: {}
};

export default function Main() {
    return (
        <div className="App">
            <Provider store={store}>
                <GraphEditor
                    templates={templates}
                    graphConfig={GRAPH_CONFIG}
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
