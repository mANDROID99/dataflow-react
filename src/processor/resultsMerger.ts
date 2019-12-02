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

export function mergeResults<S, T>(allResults: NodeValue<S>[][], mapper: (value: S) => T, reducer: (left: T, right: T) => T): T[] {
    const rootNode: TreeNode<T> = emptyNode();

    // write results to tree
    for (const results of allResults) {
        for (const result of results) {
            let node = rootNode;

            for (const parent of result.parent) {
                node = getOrCreateNode(node, parent);
            }

            node = getOrCreateNode(node, result.correlationId);
            if (node.value !== undefined) {
                node.value = reducer(node.value, mapper(result.data));
            } else {
                node.value = mapper(result.data);
            }
        }
    }

    function flatten(node: TreeNode<T>): T[] {
        const children = node.children;
        if (children && children.size) {
            const results: T[] = [];

            for (const child of children.values()) {
                const childValues = flatten(child);

                for (let value of childValues) {
                    if (node.value !== undefined) {
                        value = reducer(node.value, value);
                    }

                    results.push(value);
                }
            }

            return results;

        } else {
            return [node.value!];
        }
    }

    // flatten the tree to a list of results
    return flatten(rootNode);
}
