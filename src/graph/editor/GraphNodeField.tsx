import React from 'react';
import styles from './GraphEditor.module.scss';
import { translate,  Dims } from './dimensions';
import { GraphNodeFieldConfig } from 'graph/types/graphConfigTypes';

type Props<Ctx> = {
    index: number;
    nodeId: string;
    fieldId: string;
    fieldValue: unknown;
    fieldConfig: GraphNodeFieldConfig<Ctx>;
    dims: Dims;
}

function GraphNodeField<Ctx>(props: Props<Ctx>) {
    const { fieldId, dims, fieldConfig } = props;

    props.fieldConfig.editor;
    

    return (
        <g transform={translate(dims.x, dims.y)}>
            <text className={styles.fieldLabel}>
                {fieldConfig.label}
            </text>
        </g>
    )
}

export default React.memo(GraphNodeField);
