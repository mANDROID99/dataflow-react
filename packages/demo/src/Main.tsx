import { ChartParams, graphConfig, Preview, RequestParams, templates } from '@react-ngraph/chart-nodes';
import { GraphEditor } from '@react-ngraph/core';
import React from 'react';

function requestHandler(params: RequestParams) {
    return fetch(params.url, {
        method: params.method,
        headers: params.headers,
        body: params.body
    });
}

const params: ChartParams = {
    variables: {
        test: 1
    },
    actions: {
        fetch: requestHandler
    }
}

export default function Main() {
    return (
        <div className="App">
            <GraphEditor
                templates={templates}
                graphConfig={graphConfig}
                params={params}
                renderPreview={(graph) => {
                    return (
                        <Preview
                            graph={graph}
                            graphConfig={graphConfig}
                            params={params}
                        />
                    );
                }}
            />
        </div>
    );
}
