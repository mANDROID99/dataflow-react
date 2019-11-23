import { createStore, combineReducers } from 'redux';
import graphReducer from '../editor/graphReducer';
import { StoreState } from './storeTypes';

const reducer = combineReducers<StoreState>({
    editor: graphReducer
});

export const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
