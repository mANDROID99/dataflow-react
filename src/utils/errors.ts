
export function throwUnrecognizedNodeType(nodeType: string, msg?: string): never {
    throwError(`Unrecognized node type. No definition exists for node with type "${nodeType}"`, msg);
}

export function throwNodeNotFound(nodeId: string, msg?: string): never {
    throwError(`Reference to node with id "${nodeId}" cannot be resolved because it does not exist.`, msg);
}

export function throwError(detailMsg: string, msg?: string): never {
    let message = detailMsg;
    if (msg) message = msg + '. ' + message;
    throw new Error(message);
}
