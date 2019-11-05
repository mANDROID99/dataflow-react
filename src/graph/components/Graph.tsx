import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GraphSpec } from '../types/graphSpecTypes';
import { GraphActions } from '../types/graphEditorTypes';
import { StoreState } from '../../store/storeTypes';
import { removeNode, setNodePosition, setNodeFieldValue, clearPortConnections, addPortConnection } from '../../store/graphActions';
import { GraphEditor } from '../editor/GraphEditor';

type Props = {
    graphId: string;
    spec: GraphSpec;
}

type EditorWithDeps = {
    editor: GraphEditor;
    spec: GraphSpec;
    actions: GraphActions;
}

export default function GraphComponent({ graphId, spec }: Props): JSX.Element {
    const elRef = useRef<SVGSVGElement>(null);
    const editorRef = useRef<EditorWithDeps>();
    const graph = useSelector((state: StoreState) => state.graph.graphs[graphId]);

    const dispatch = useDispatch();
    const actions = useMemo((): GraphActions => {
        return {
            removeNode(node: string): void {
                dispatch(removeNode(graphId, node));
            },

            setNodePosition(node: string, x: number, y: number): void {
                dispatch(setNodePosition(graphId, node, x, y));
            },

            setNodeFieldValue(node: string, field: string, value: unknown): void {
                dispatch(setNodeFieldValue(graphId, node, field, value));
            },

            clearPortConnections(node: string, port: string, portOut: boolean): void {
                dispatch(clearPortConnections(graphId, node, port, portOut));
            },

            addPortConnection(node: string, port: string, portOut: boolean, targetNode: string, targetPort: string): void {
                dispatch(addPortConnection(graphId, node, port, portOut, targetNode, targetPort));
            }
        };
    }, [graphId, dispatch]);

    useEffect(() => {
        const el = elRef.current;
        if (el) {
            let prev = editorRef.current;
            if (!prev || prev.actions !== actions || prev.spec !== spec) {
                const editor = new GraphEditor(el, actions, spec, graph);
                prev = { editor, spec, actions };
                editorRef.current = prev;

            } else {
                prev.editor.updateGraph(graph);
            }
        }
    }, [graph, spec, actions]);

    return (
        <svg className="graph-svg" ref={elRef} width="800" height="600">
        </svg>
    );
}
