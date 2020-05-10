import { GraphDef, NodeDef, NodeDims } from "../types/graphDefTypes";

const DEFAULT_NODE_DIMS: NodeDims = {
    padH: 5,
    padV: 5,
    width: 50,
    height: 50
}

export function resolveNodeDims<Params, Ctx>(graphDef: GraphDef<Params, Ctx>, nodeDef: NodeDef<Params, Ctx, any>): NodeDims {
    let dims = DEFAULT_NODE_DIMS;

    if (graphDef.dims) {
        const graphDims = graphDef.dims;
        if (graphDims.node) {
            dims = Object.assign({}, DEFAULT_NODE_DIMS, graphDims.node);
        }
    }

    if (nodeDef.dims) {
        if (dims === DEFAULT_NODE_DIMS) {
            dims = Object.assign({}, DEFAULT_NODE_DIMS);
        }

        Object.assign(dims, nodeDef.dims);
    }
    
    return dims;
}
