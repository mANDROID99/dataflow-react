import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { StoreState } from '../types/storeTypes';
import editorReducer from './editorReducer';

const rootReducer = combineReducers<StoreState>({
    editor: editorReducer
})

export default configureStore<StoreState>({ reducer: rootReducer });
