import React from 'react';
import { GraphNodeComponentProps } from '../../../types/graphNodeComponentTypes';
import GraphNodeField from './GraphNodeField';
import GraphNodeHeader from './GraphNodeHeader';

export type DragPosState = {
    x: number;
    y: number;
}

export type DragWidthState = {
    width: number;
}

export default function GraphNodeComponent<Ctx, Params>({ node, nodeConfig, nodeId, context, handleDrag, width, actions }: GraphNodeComponentProps<Ctx, Params>) {
    return (
        <div className="ngraph-node-body" style={{ width }}>
            <GraphNodeHeader
                nodeId={nodeId}
                node={node}
                nodeConfig={nodeConfig}
                onDrag={handleDrag}
            />
            {!node.collapsed && (
                <div className="ngraph-node-fields">
                    {Object.entries(nodeConfig.fields).map(([fieldName, fieldConfig]) => {
                        return (
                            <GraphNodeField<Ctx, Params>
                                key={fieldName}
                                nodeId={nodeId}
                                context={context}
                                fieldName={fieldName}
                                fieldConfig={fieldConfig}
                                actions={actions}
                                fields={node.fields}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
