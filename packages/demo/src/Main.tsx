import React from 'react';
import { GraphEditor } from '@react-ngraph/core';
import { graphConfig, templates, Preview } from '@react-ngraph/chart-nodes';

const VARIABLES = {
    test: 1
};

export default function Main() {
    return (
        <div className="App">
            <GraphEditor
                initialGraph={templates[0].data}
                templates={templates}
                graphConfig={graphConfig}
                params={{ variables: VARIABLES }}
                renderPreview={({ graph, width, height }) => {
                    return (
                        <Preview
                            graph={graph}
                            graphConfig={graphConfig}
                            variables={VARIABLES}
                            width={width}
                            height={height}
                        />
                    );
                }}
            />
        </div>
    );
}
