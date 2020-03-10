import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGraph } from '../../../store/actions';
import { selectTemplateId } from '../../../store/selectors';
import { useGraphContext } from '../../graphEditorContext';

function GraphTemplateChooser() {
    const dispatch = useDispatch();
    const { templates } = useGraphContext();
    const templateId = useSelector(selectTemplateId(templates));

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const template = templates.find(t => t.id === e.target.value);

        if (template) {
            dispatch(loadGraph(template.data));
        }
    };

    return (
        <div className="ngraph-p-2">
            <div className="ngraph-mb-1 ngraph-text-label">Template</div>
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
