import React from 'react';
import { GraphNodeComponentProps } from "../../../types/graphConfigTypes";
import GraphNodeField from './GraphNodeField';
import GraphNodeHeader from './GraphNodeHeader';

export type DragPosState = {
    x: number;
    y: number;
}

export type DragWidthState = {
    width: number;
}

export default function GraphNodeContainer<Ctx, Params>({ node, nodeConfig, nodeId, context, handleDragPos, handleDragWidth, width, actions }: GraphNodeComponentProps<Ctx, Params>) {
    return (
        <div className="ngraph-node-body" style={{ width }}>
            <GraphNodeHeader
                nodeId={nodeId}
                node={node}
                nodeConfig={nodeConfig}
                onDragPos={handleDragPos}
                onDragWidth={handleDragWidth}
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
