/* @flow */

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import createAuthAwareNetworkInterface from './createAuthAwareNetworkInterface';
import Auth0Api from './Auth0Api';
import AuthTokenActions from '../Flux/AuthTokenActions';

const GRAPHQL_ENDPOINT = 'https://exp.host/--/graphql';
const GRAPHQL_SUBSCRIPTIONS = 'ws://exp.host/--/subscriptions';

function getIdToken() {
  let Store = require('../Flux/Store').default;
  let state = Store.getState();
  if (state.authTokens) {
    return state.authTokens.idToken;
  } else {
    return null;
  }
}

function getRefreshToken() {
  let Store = require('../Flux/Store').default;
  let state = Store.getState();
  if (state.authTokens) {
    return state.authTokens.refreshToken;
  } else {
    return null;
  }
}

function setIdToken(idToken) {
  let Store = require('../Flux/Store').default;
  Store.dispatch(AuthTokenActions.updateIdToken(idToken));
}

function idTokenIsValid() {
  let idToken = getIdToken();

  if (!idToken) {
    return false;
  } else {
    return !Auth0Api.tokenIsExpired(idToken);
  }
}

async function refreshIdTokenAsync() {
  let newAuthTokens = await Auth0Api.refreshIdTokenAsync(getRefreshToken());
  return newAuthTokens.id_token;
}

const wsClient = new SubscriptionClient(GRAPHQL_SUBSCRIPTIONS, {
  reconnect: true,
});

const networkInterface = createAuthAwareNetworkInterface({
  uri: GRAPHQL_ENDPOINT,
  wsClient,
  getIdToken,
  setIdToken,
  getRefreshToken,
  idTokenIsValid,
  refreshIdTokenAsync,
});

export default new ApolloClient({
  dataIdFromObject: result => {
    if (result.id && result.__typename) {
      return result.__typename + result.id;
    }

    // Make sure to return null if this object doesn't have an ID
    return null;
  },
  networkInterface,
});
