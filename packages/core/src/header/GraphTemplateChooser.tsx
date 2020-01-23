import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGraphContext } from '../editor/graphEditorContext';
import { loadGraph } from '../store/actions';
import { createTemplateIdSelector } from '../store/selectors';

function GraphTemplateChooser() {
    const dispatch = useDispatch();
    const { templates } = useGraphContext();
    const templateId = useSelector(createTemplateIdSelector(templates));

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const template = templates.find(t => t.id === e.target.value);

        if (template) {
            dispatch(loadGraph(template.graph));
        }
    };

    return (
        <div className="ngraph-templates">
            <span className="ngraph-header-label">Template</span>
            <select className="ngraph-input" value={templateId ?? ''} onChange={handleChange}>
                <option disabled value=""></option>
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.label}</option>
                ))}
            </select>
        </div>
    );
}

export default GraphTemplateChooser;
