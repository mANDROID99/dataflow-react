import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';

import { useToggle } from '../../../utils/hooks/useToggle';
import { selectAutoUpdate } from '../../../store/selectors';
import { setAutoUpdate } from '../../../store/actions';
import PreviewContent from './PreviewContent';
import { Graph } from '../../../types/graphTypes';

type Props = {
    renderPreview: (graph: Graph) => React.ReactNode | null;
}

function Preview(props: Props) {
    const autoUpdate = useSelector(selectAutoUpdate);
    const dispatch = useDispatch();
    const [minimized, toggleMinimized] = useToggle(false);

    const handleToggleAutoUpdate = () => {
        dispatch(setAutoUpdate(!autoUpdate));
    };

    return (
        <div className="ngraph-preview">
            <div className="ngraph-preview-header">
                <span className="ngraph-preview-header-title">Preview</span>
                {!minimized && <span className="ngraph-preview-header-autoupdate">
                    <input type="checkbox" id="auto-update" checked={autoUpdate} onChange={handleToggleAutoUpdate}/>
                    <label htmlFor="auto-update">Auto-Update</label>
                </span>}
                <FontAwesomeIcon className="ngraph-preview-header-icon" icon={minimized ? "plus" : "minus"} onClick={toggleMinimized}/>
            </div>
            {!minimized ? (
                <PreviewContent renderPreview={props.renderPreview}/>
            ) : undefined}
        </div>
    );
}

export default React.memo(Preview);
