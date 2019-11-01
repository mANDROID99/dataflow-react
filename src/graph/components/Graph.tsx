import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Graph } from "../types/graphTypes";
import { GraphSpec } from '../types/graphSpecTypes';
import { createGraphEditor } from '../d3/createGraph';
import { GraphActions } from '../types/graphD3types';
import { removeNode, setNodePosition, setNodeFieldValue, clearPortConnections, addPortConnection } from '../../store/graphActions';
import { StoreState } from '../../store/storeTypes';

type Props = {
    graphId: string;
    spec: GraphSpec;
}

type EditorWithDeps = {
    editor: (graph: Graph) => void;
    spec: GraphSpec;
    actions: GraphActions;
}

export default function GraphComponent({ graphId, spec }: Props) {
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
        }
    }, [graphId, dispatch]);

    useEffect(() => {
        const el = elRef.current;
        if (el) {
            let prev = editorRef.current;
            if (!prev || prev.actions !== actions || prev.spec !== spec) {
                const editor = createGraphEditor(el, spec, actions);
                prev = { editor, spec, actions };
                editorRef.current = prev;
            }

            prev.editor(graph);
        }
    }, [graph, spec, actions]);

    return (
        <svg className="graph-svg" ref={elRef} width="800" height="600">
        </svg>
    );
}
