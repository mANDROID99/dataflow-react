import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphPreviewParams } from '../../../types/graphEditorTypes';
import { useToggle } from '../../../utils/hooks/useToggle';
import { useSelector } from 'react-redux';
import { selectGraph } from '../../../store/selectors';
import Button from '../../../common/Button';

type Props = {
    renderPreview: (params: GraphPreviewParams) => React.ReactNode | null;
}

function GraphEditorPreview(props: Props) {
    const graph = useSelector(selectGraph);
    const [graphBuffered, setGraphBuffered] = useState(graph);

    const [minimized, toggleMinimized] = useToggle(false);
    const [dims] = useState({ width: 300, height: 300 });

    const handleUpdate = () => {
        setGraphBuffered(graph);
    };

    return (
        <div className="ngraph-preview">
            <div className="ngraph-preview-header">
                <span className="ngraph-preview-header-title">Preview</span>
                {graph !== graphBuffered && (
                    <Button onClick={handleUpdate}>Update</Button>
                )}
                <FontAwesomeIcon className="ngraph-preview-header-icon" icon={minimized ? "plus" : "minus"} onClick={toggleMinimized}/>
            </div>
            {!minimized ? (
                <div
                    className="ngraph-preview-body"
                    style={{
                        width: dims.width,
                        height: dims.height
                    }}
                >
                    {props.renderPreview({
                        graph: graphBuffered,
                        width: dims.width,
                        height: dims.height
                    })}
                </div>
            ) : undefined}
        </div>
    );
}

export default React.memo(GraphEditorPreview);
