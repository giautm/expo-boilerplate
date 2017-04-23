/**
 * @providesModule LocalStorage
 */
'use strict';

import { AsyncStorage } from 'react-native';
import { LegacyAsyncStorage } from 'expo';
import mapValues from 'lodash/mapValues';

const Keys = mapValues({
  AuthTokens: 'authTokens',
}, (value) => `Expo.${value}`);

async function getAuthTokensAsync() {
  let results = await AsyncStorage.getItem(Keys.AuthTokens);

  try {
    let authTokens = JSON.parse(results);
    return authTokens;
  } catch (e) {
    return null;
  }
}

async function saveAuthTokensAsync(authTokens) {
  return AsyncStorage.setItem(Keys.AuthTokens, JSON.stringify(authTokens));
}

async function updateIdTokenAsync(idToken) {
  let tokens = await getAuthTokensAsync();

  if (!tokens) {
    await clearAllAsync();
    throw new Error('Missing cached authentication tokens');
  }

  return saveAuthTokensAsync({ ...tokens, idToken });
}

async function removeAuthTokensAsync() {
  return AsyncStorage.removeItem(Keys.AuthTokens);
}

async function clearAllAsync() {
  await Promise.all(Object.values(Keys).map(k => AsyncStorage.removeItem(k)));
}

export default {
  clearAllAsync,
  getAuthTokensAsync,
  saveAuthTokensAsync,
  removeAuthTokensAsync,
  updateIdTokenAsync,
};
