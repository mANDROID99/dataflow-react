import React from 'react';
import { Provider } from 'react-redux';
import { GraphEditor } from '@react-ngraph/core';

import { GRAPH_CONFIG } from './config/graphConfig';
import Preview from './preview/Preview';
import { templates } from './templates/templates';
import { store } from './store';

const VARIABLES = {
    test: 1
};

export default function Main() {
    return (
        <div className="App">
            <Provider store={store}>
                <GraphEditor
                    initialGraph={templates[0].data}
                    templates={templates}
                    graphConfig={GRAPH_CONFIG}
                    params={{ variables: VARIABLES }}
                    renderPreview={({ graph, width, height }) => {
                        return (
                            <Preview
                                graph={graph}
                                graphConfig={GRAPH_CONFIG}
                                variables={VARIABLES}
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
