import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer } from './reducer';
import { StoreState } from '../types/storeTypes';

const reducers = combineReducers<StoreState>({
    editor: reducer
});

export function initStore() {
    return createStore(
        reducers,
        composeWithDevTools({
            name: 'graph-editor'
        })()
    );
}
