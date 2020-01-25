import React, { useMemo, useState } from 'react';
import Button from '../common/Button';
import { useSelector, useDispatch } from 'react-redux';
import { selectGraph } from '../store/selectors';
import { loadGraph } from '../store/actions';

type Props = {
    onHide: () => void;
}

function GraphDataExporterModal(props: Props) {
    const graph = useSelector(selectGraph);
    const dispatch = useDispatch();

    // convert the graph to JSON
    const dataJSON = useMemo(() => JSON.stringify(graph, null, 2), [graph]);

    const [input, setInput] = useState(dataJSON);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = () => {
        try {
            const graph = JSON.parse(input);
            dispatch(loadGraph(graph));
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

