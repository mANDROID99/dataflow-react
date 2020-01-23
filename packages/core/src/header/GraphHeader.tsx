import React from 'react';
import GraphTemplateChooser from './GraphTemplateChooser';
import GraphDataExporter from './GraphDataEditor';
import { Graph } from '../types/graphTypes';

type Props = {
    templateId: string | undefined;
    graph: Graph;
}

function GraphHeader(props: Props) {
    return (
        <div className="ngraph-header">
            <div className="ngraph-header-mid">
                <GraphTemplateChooser templateId={props.templateId}/>
            </div>
            <GraphDataExporter graph={props.graph}/>
        </div>
    );
}

export default React.memo(GraphHeader);
