import { createContext, useContext } from 'react';
import { GraphDef } from '../types/graphDefTypes';

export type EditorContext<Params, Ctx> = {
    graphDef: GraphDef<Params, Ctx>;
    params: Params;
}

export const editorContext = createContext<EditorContext<any, any> | null>(null);

export function useEditorContext<Params, Ctx>(): EditorContext<Params, Ctx> {
    return useContext(editorContext)!;
}
