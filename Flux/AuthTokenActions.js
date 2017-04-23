/**
 * @providesModule AuthTokenActions
 */
'use strict';

import { Amplitude } from 'expo';
import jwtDecode from 'jwt-decode';
import { action } from 'Flux';
import LocalStorage from '../Storage/LocalStorage';
import ApolloClient from '../Api/ApolloClient';

let AuthTokenActions = {
  signIn(tokens) {
    ApolloClient.resetStore();
    return AuthTokenActions.setAuthTokens(tokens);
  },

  @action setAuthTokens(tokens) {
    const { sub } = jwtDecode(tokens.idToken, { complete: true });
    Amplitude.setUserId(sub);
    LocalStorage.saveAuthTokensAsync(tokens);
    return tokens;
  },

  @action updateIdToken(idToken) {
    const { sub } = jwtDecode(idToken, { complete: true });
    Amplitude.setUserId(sub);
    LocalStorage.updateIdTokenAsync(idToken);
    return { idToken };
  },

  @action signOut() {
    Amplitude.setUserId(null);
    LocalStorage.removeAuthTokensAsync();
    LocalStorage.clearHistoryAsync();
    ApolloClient.resetStore();
    return null;
  },
};

export default AuthTokenActions;
