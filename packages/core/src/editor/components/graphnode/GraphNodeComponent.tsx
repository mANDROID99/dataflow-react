import React from 'react';
import { GraphNodeComponentProps } from '../../../types/graphNodeComponentTypes';
import GraphNodeFieldGroups from './GraphNodeFieldGroups';
import GraphNodeHeader from './GraphNodeHeader';

export type DragPosState = {
    x: number;
    y: number;
}

export type DragWidthState = {
    width: number;
}

export default function GraphNodeComponent<C, P>({ node, nodeConfig, nodeId, context, handleDrag, width, actions }: GraphNodeComponentProps<C, P>) {
    return (
        <div className="ngraph-node-body" style={{ width }}>
            <GraphNodeHeader
                nodeId={nodeId}
                node={node}
                nodeConfig={nodeConfig}
                onDrag={handleDrag}
            />
            {!node.collapsed && (
                <GraphNodeFieldGroups
                    nodeConfig={nodeConfig}
                    fields={node.fields}
                    actions={actions}
                    context={context}
                />
            )}
        </div>
    );
}
