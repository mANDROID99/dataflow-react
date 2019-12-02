import { NodeValue } from "../types/nodeProcessorTypes";

type TreeNode<T> = {
    value?: T;
    children?: Map<string, TreeNode<T>>;
}

function emptyNode<T>(): TreeNode<T> {
    return {};
}

function getOrCreateNode<T>(node: TreeNode<T>, childName: string): TreeNode<T> {
    if (!node.children) {
        node.children = new Map<string, TreeNode<T>>();
    }

    let childNode = node.children.get(childName);
    if (!childNode) {
        childNode = emptyNode();
        node.children.set(childName, childNode);
    }

    return childNode;
}

export function join<S, T>(allResults: NodeValue<T>[][], seed: S, reducer: (left: S, right: T) => S): S[] {
    const rootNode: TreeNode<T> = emptyNode();

    // write results to tree
    for (const results of allResults) {
        for (const result of results) {
            let node = rootNode;

            for (const parent of result.parent) {
                node = getOrCreateNode(node, parent);
            }

            node = getOrCreateNode(node, result.correlationId);
            node.value = result.data;
        }
    }

    function flatten(value: S, node: TreeNode<T>): S[] {
        if (node.value !== undefined) {
            value = reducer(value, node.value);
        }

        const children = node.children;
        if (children && children.size) {
            const results: S[] = [];

            for (const child of children.values()) {
                const childValues = flatten(value, child);

                for (const childValue of childValues) {
                    results.push(childValue);
                }
            }

            return results;

        } else {
            return [value];
        }
    }

    // flatten the tree to a list of results
    return flatten(seed, rootNode);
}
