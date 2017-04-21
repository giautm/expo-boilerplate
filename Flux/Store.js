/**
 * @providesModule AppStore
 */
'use strict';

import AuthTokenReducer from 'AuthTokenReducer';
import Flux from 'Flux';
import ApolloClient from '../Api/ApolloClient';
import AppNavigator from '../App/navigation';

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return (newState ? newState : state)
};

const reducers = {
  authTokens: AuthTokenReducer,
  apollo: ApolloClient.reducer(),
  nav: navReducer,
};

const store = Flux.createStore(reducers);

export default store;
