// SPDX-License-Identifier: MIT
// Copyright contributors to the hubble.gl project

import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import thunk from 'redux-thunk';
// eslint-disable-next-line no-unused-vars
import window from 'global/window';

import demoReducer from './reducers/index';

const reducers = combineReducers({
  demo: demoReducer
});

export const middlewares = enhanceReduxMiddleware([thunk]);

export const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// eslint-disable-next-line prefer-const
let composeEnhancers = compose;

/**
 * comment out code below to enable Redux Devtools
 */

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionsBlacklist: [
      '@@kepler.gl/MOUSE_MOVE',
      '@@kepler.gl/UPDATE_MAP',
      '@@kepler.gl/LAYER_HOVER'
    ]
  });
}

export default createStore(reducers, initialState, composeEnhancers(...enhancers));
