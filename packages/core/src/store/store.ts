import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { StoreState } from '../types/storeTypes';
import { reducer } from './reducer';

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
