import { OutputValue } from "./nodeDataTypes";

type Point = {
    [key: string]: string | number | boolean;
}

type Node = {
    values: Point,
    children?: Map<string, Node>;
}

function createNode(): Node {
    return {
        values: {}
    };
}

function getOrCreateChildNode(node: Node, childName: string): Node {
    if (!node.children) {
        node.children = new Map<string, Node>();
    }

    let childNode = node.children.get(childName);
    if (!childNode) {
        childNode = createNode();
        node.children.set(childName, childNode);
    }

    return childNode;
}

// recursively flatten the tree to points.
// Caution!! It mutates the original nodes to avoid creating extra objects
function flatten(node: Node): Point[] {
    const values = node.values;

    if (node.children) {
        const results: Point[] = [];

        for (let child of node.children.values()) {
            const childValues = flatten(child);

            for (let childValue of childValues) {
                results.push(Object.assign(childValue, values));
            }
        }

        return results;

    } else {
        return [values];
    }
}

export function resultCollector(results: OutputValue[]): Point[] {
    const rootNode: Node = createNode();

    // write results to tree
    for (let result of results) {
        let node = rootNode;

        for (let parent of result.parent) {
            node = getOrCreateChildNode(node, parent);
        }

        node = getOrCreateChildNode(node, result.correlationId);
        node.values[result.outputKey] = result.outputValue;
    }

    // flatten the tree to points
    return flatten(rootNode);
}