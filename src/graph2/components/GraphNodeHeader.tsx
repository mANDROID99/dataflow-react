import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GraphNodeSpec } from '../types/graphSpecTypes';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faTimes);

type Props = {
    spec: GraphNodeSpec | undefined;
}

const TITLE_UNKNOWN = 'Unknown';

function GraphNodeHeader(props: Props): React.ReactElement {
    return (
        <div className="graph-node-header">
            <div className="graph-node-header-title">
                { props.spec ? props.spec.title : TITLE_UNKNOWN }
            </div>
            <div className="graph-node-header-close-icon">
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(GraphNodeHeader);
