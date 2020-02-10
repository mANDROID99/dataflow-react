import { useRef, useMemo } from 'react';
import { Dispatch } from 'redux';

import { GraphNode } from '../../../types/graphTypes';
import { CallbackParams, GraphNodeConfig } from '../../../types/graphConfigTypes';
import { GraphNodeCallbacks } from '../../../types/graphInputTypes';
import { setFieldValue } from '../../../store/actions';

/**
 * Callback handlers for internal node events
 * 
 * optimized for referential equality - returns the same instance every time
 */

export function useGraphNodeCallbacks<Ctx, Params>(nodeId: string, node: GraphNode, nodeConfig: GraphNodeConfig<Ctx, Params>, context: Ctx, params: Params, dispatch: Dispatch): GraphNodeCallbacks {
    const callbackParams: CallbackParams<Ctx, Params> = {
        node,
        context,
        params,
        setFieldValue(name: string, value: unknown) {
            dispatch(setFieldValue(nodeId, name, value));
        }
    };

    const ref = useRef<CallbackParams<Ctx, Params>>(callbackParams);
    ref.current = callbackParams;

    return useMemo<GraphNodeCallbacks>(() => ({

        // node field changed
        onChanged(prev, next) {
            if (nodeConfig.onChanged) {
                nodeConfig.onChanged(prev, next, ref.current);
            }
        },

        // event emitted
        onEvent(eventName, payload) {
            if (nodeConfig.onEvent) {
                nodeConfig.onEvent(eventName, payload, ref.current);
            }
        }
    }), [nodeConfig]);
}
