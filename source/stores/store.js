'use strict';
import rootReducer from '../reducers/login';

import { persistState } from 'redux-devtools';
import { compose, createStore, applyMiddleware } from 'redux';
// Thunk allows an action creator to return a function instead of plain-object.
// see more in login.js
import thunk from 'redux-thunk';
// The devtools package is needed for development only and must be removed when going to production.
import DevTools from '../devtools';

const configureStore = compose(
  applyMiddleware(thunk),
  DevTools.instrument()
)(createStore);
const store = configureStore(rootReducer);

export default store;

