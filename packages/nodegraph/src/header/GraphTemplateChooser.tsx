import React from 'react';
import { GraphActionType } from '../types/graphReducerTypes';
import { useGraphContext } from '../editor/graphEditorContext';

type Props = {
    templateId: string | undefined;
}

function GraphTemplateChooser(props: Props) {
    const { dispatch, templates } = useGraphContext();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const template = templates.find(t => t.id === e.target.value);

        if (template) {
            dispatch({
                type: GraphActionType.LOAD_GRAPH,
                graph: template.graph
            });
        }
    };

    return (
        <div className="ngraph-templates">
            <span className="ngraph-header-label">Template</span>
            <select className="ngraph-input" value={props.templateId ?? ''} onChange={handleChange}>
                <option disabled value=""></option>
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.label}</option>
                ))}
            </select>
        </div>
    );
}

export default GraphTemplateChooser;
