import React from 'react';
import GraphTemplateChooser from './GraphTemplateChooser';
import GraphDataExporter from './GraphDataEditor';

function GraphHeader() {
    return (
        <div className="ngraph-header">
            <div className="ngraph-header-mid">
                <GraphTemplateChooser/>
            </div>
            <GraphDataExporter/>
        </div>
    );
}

export default React.memo(GraphHeader);
