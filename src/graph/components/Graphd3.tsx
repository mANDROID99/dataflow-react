import React, { useRef, useEffect } from 'react';

import { Graph } from "../types/graphTypes";
import { GraphSpec } from '../types/graphSpecTypes';
import { GraphActions } from '../graphContext';
import { createGraphEditor } from './d3/createGraph';

type Props = {
    graph: Graph;
    spec: GraphSpec;
    actions: GraphActions;
}

type EditorWithDeps = {
    editor: (graph: Graph) => void;
    spec: GraphSpec;
    actions: GraphActions;
}

export default function Graphd3({ graph, spec, actions }: Props) {
    const elRef = useRef<SVGSVGElement>(null);
    const editorRef = useRef<EditorWithDeps>();

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
