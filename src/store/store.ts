import { createStore, combineReducers } from 'redux';
import { StoreState } from '../types/storeTypes';
import editorReducer from '../editor/editorReducer';
import appReducer from './appReducers';

const reducer = combineReducers<StoreState>({
    editor: editorReducer,
    app: appReducer
});

export const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
