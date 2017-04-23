/**
 * @providesModule AppStore
 */
'use strict';
import { reducer as formReducer } from 'redux-form/immutable';

import Flux from 'Flux';
import AuthTokenReducer from 'AuthTokenReducer';
import ApolloClient from '../Api/ApolloClient';
import AppNavigator from '../App/navigation';

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return (newState ? newState : state)
};

const store = Flux.createStore({
  authTokens: AuthTokenReducer,
  apollo: ApolloClient.reducer(),
  form: formReducer,
  nav: navReducer,
});

export default store;
