import React from 'react';
import { GraphEditor } from '@react-ngraph/core';
import { graphConfig, templates, Preview, ChartParams, RequestParams } from '@react-ngraph/chart-nodes';

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
    fetch: requestHandler,
    runReport: () => {
        throw new Error('Not implemented');
    },
    reports: [
        {
            name: 'First Report',
            uuid: 'report-1',
            parameters: [
                { name: 'a', defaultValue: 'A' }
            ]
        },
        {
            name: 'Second Report',
            uuid: 'report-2',
            parameters: [
                { name: 'b', defaultValue: 'B' }
            ]
        }
    ]
}

export default function Main() {
    return (
        <div className="App">
            <GraphEditor
                // initialGraph={templates[0].data}
                templates={templates}
                graphConfig={graphConfig}
                params={params}
                renderPreview={({ graph }) => {
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
