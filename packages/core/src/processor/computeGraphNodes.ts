import { GraphNode, Graph } from "../types/graphTypes";
import { GraphConfig, ResolverParams, GraphNodeFieldConfig } from "../types/graphConfigTypes";
import { ComputedNode, ComputedField, GraphFieldInputConfig } from "../types/graphInputTypes";
import { resolve } from '../utils/resolverUtils';
import { NodeProcessor } from "../types/processorTypes";

/**
 * Fully resolves the dynamic parts of the node configuration.
 */
export function computeGraphNodes<Ctx, Params>(
    graph: Graph,
    graphConfig: GraphConfig<Ctx, Params>,
    params: Params | undefined
): Map<string, ComputedNode<Ctx>> {

    if (params === undefined) {
        params = graphConfig.params!;
    }

    const baseContext = graphConfig.context;
    const resolved = new Map<string, ComputedNode<Ctx>>();
    const seen = new Set<string>();

    function registerParentProcessors(node: GraphNode, processor: NodeProcessor, parents: { [key: string]: ComputedNode<Ctx>[] }) {
        const ports = node.ports.in;

        for (const portId in ports) {
            const portTargets = ports[portId];
            const portParents = parents[portId];
            
            if (portParents && portTargets && portTargets.length === portParents.length) {
                for (let i = 0, n = portTargets.length; i < n; i++) {
                    const portTarget = portTargets[i];
                    const portParent = portParents[i];
                    processor.registerProcessor(portId, portTarget.port, portParent.processor);                    
                }
            }
        }
    }

    function resolveFieldInput(
        key: string,
        field: { [key: string]: unknown },
        fieldConfig: GraphNodeFieldConfig<Ctx, Params>,
        inputConfig: GraphFieldInputConfig
    ) {
        if (Object.prototype.hasOwnProperty.call(field, key)) {
            const v = field[key];

            if (inputConfig.validate) {
                if (inputConfig.validate(v)) {
                    return v;
                }

            } else if (v != null) {
                return v;
            }
        }

        if (Object.prototype.hasOwnProperty.call(fieldConfig, 'initialValue')) {
            return fieldConfig.initialValue;
        }

        return inputConfig.initialValue;
    }

    function resolveGraphNodeById(nodeId: string): ComputedNode<Ctx> {
        const node = graph.nodes[nodeId];
        if (!node) {
            throw new Error(`No graph-node exists with id "${nodeId}"`);
        }

        const nodeConfig = graphConfig.nodes[node.type];
        if (resolved.has(nodeId)) {
            // the node has already been processed
            return resolved.get(nodeId)!;
        }

        if (seen.has(nodeId)) {
            throw new Error(`Cyclic dependency detected while computing graph-node with id "${nodeId}"`);
        }

        // register this node-id has been seen, avoid infinite loop
        seen.add(nodeId);

        const parents: { [key: string]: ComputedNode<Ctx>[] } = {};
        const portConfigs = nodeConfig.ports.in;
        const ports = node.ports.in;
        let parentContext: Ctx = baseContext;

        for (const portId in portConfigs) {
            const portTargets = ports[portId];
            
            if (portTargets) {
                const n = portTargets.length;
                const portParents = new Array<ComputedNode<Ctx>>(n);

                // resolve parents and merge contexts
                for (let i = 0; i < n; i++) {
                    const parentNodeId = portTargets[i].node;
                    const parent = resolveGraphNodeById(parentNodeId);

                    parentContext = graphConfig.mergeContexts(parentContext, parent.context);
                    portParents[i] = parent;
                }

                parents[portId] = portParents;
                
            } else {
                parents[portId] = [];
            }
        }

        const fields: { [key: string]: ComputedField } = {};
        const values: { [key: string]: unknown } = {};
        const resolverParams: ResolverParams<Ctx, Params> = { node, context: parentContext, params: params!, parents };

        // resolve fields
        const fieldsConfig = nodeConfig.fields;
        for (const key in fieldsConfig) {
            const fieldConfig = fieldsConfig[key];
            const inputConfig = graphConfig.inputs[fieldConfig.type];

            if (!inputConfig) {
                throw new Error(`Unknown input type "${fieldConfig.type}"`);
            }

            // resolve field params
            const fieldParams = fieldConfig.params
                ? resolve(fieldConfig.params, resolverParams) : {};

            const input = resolveFieldInput(key, node.fields, fieldConfig, inputConfig);

            // field object - will be passed into the input component
            fields[key] = {
                value: input,
                params: fieldParams
            };

            // field values - passed into the processor and context functions
            values[key] = inputConfig.resolveValue?.(input, fieldParams) ?? input;
        }

        
        // resolve the new context. Fall back to the parent context
        const context: Ctx = nodeConfig.mapContext?.(values, resolverParams) ?? parentContext;

        // create the graph-node processor
        const processor: NodeProcessor = nodeConfig.createProcessor(values, resolverParams);
        registerParentProcessors(node, processor, parents);

        const nodeResolved: ComputedNode<Ctx> = {
            context,
            fields,
            processor
        };

        resolved.set(nodeId, nodeResolved);
        return nodeResolved;
    }

    // loop through all nodes in the graph
    for (const nodeId in graph.nodes) {
        resolveGraphNodeById(nodeId);
    }

    return resolved;
}
