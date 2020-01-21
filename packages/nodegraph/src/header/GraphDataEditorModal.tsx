import React, { useMemo, useState } from 'react';
import { Graph } from "../types/graphTypes";
import { GraphActionType } from '../types/graphReducerTypes';
import Button from '../common/Button';
import { useGraphContext } from '../editor/graphEditorContext';

type Props = {
    graph: Graph;
    onHide: () => void;
}

function GraphDataExporterModal(props: Props) {
    // convert the graph to JSON
    const dataJSON = useMemo(() => JSON.stringify(props.graph, null, 2), [props.graph]);

    const [input, setInput] = useState(dataJSON);
    const { dispatch } = useGraphContext();

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = () => {
        try {
            const graph = JSON.parse(input);
            dispatch({ type: GraphActionType.LOAD_GRAPH, graph });
            props.onHide();
        } catch (e) {
            console.error('Could not be converted to JSON');
        }
    };

    return (
        <div className="ngraph-modal full">
            <div className="ngraph-modal-header">Edit as JSON</div>
            <div className="ngraph-modal-body">
                <textarea
                    className="ngraph-edit-json-input"
                    value={input}
                    onChange={handleChange}
                />
            </div>
            <div className="ngraph-modal-footer">
                <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
        </div>
    );
}

export default GraphDataExporterModal;

