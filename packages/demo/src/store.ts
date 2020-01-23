import { reducer } from '@react-ngraph/core';
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducers = combineReducers({
    graphEditor: reducer
});

export const store = createStore(reducers, composeWithDevTools());
