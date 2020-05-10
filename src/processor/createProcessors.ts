import { Graph } from "../types/graphTypes";
import { GraphDef } from "../types/graphDefTypes";
import { NodeProcessor } from "../types/processorTypes";
import { throwUnrecognizedNodeType, throwNodeNotFound } from "../utils/errors";

export function createProcessors<Params, Ctx>(graphDef: GraphDef<Params, Ctx>, graph: Graph, params: Params) {
    const processors = new Map<string, NodeProcessor<Ctx>>();

    // construct node processors
    const nodes = graph.nodes;
    for (const nodeId in nodes) {
        const node = nodes[nodeId];
        const nodeDef = graphDef.nodes[node.type];
        if (!nodeDef) {
            throwUnrecognizedNodeType(node.type, 'Cannot create processor');
        }

        const processor = nodeDef.processor(node.config, params);
        processors.set(nodeId, processor);
    }

    // register connections between nodes
    const connections = graph.connections;
    for (const conn of connections) {
        const outProc = processors.get(conn.outNode);
        if (!outProc) {
            throwNodeNotFound(conn.outNode, 'Cannot resolve connection');
        }

        const inProc = processors.get(conn.inNode);
        if (!inProc) {
            throwNodeNotFound(conn.inNode, 'Cannot resolve connection');
        }

        if (outProc.register) {
            outProc.register(conn.outPort, conn.inPort, inProc);
        }

        if (inProc.registerInverse) {
            inProc.registerInverse(conn.inPort, outProc);
        }
    }

    return processors;
}
