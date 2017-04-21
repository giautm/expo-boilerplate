/* @flow */

import jwtDecode from 'jwt-decode';
import { Constants } from 'expo';

const AUTH0_DOMAIN = 'https://exponent.auth0.com/';
const AUTH0_CLIENT_ID = 'qIdMWQxxXqD8PbCA90mZh0r2djqJylzg';
const AUTH0_SCOPE = 'openid offline_access nickname username';

const SignUpEndpoint = 'https://exp.host/--/api/v2/auth/createOrUpdateUser';

async function signInAsync(username, password) {
  let response = await fetch(`${AUTH0_DOMAIN}oauth/ro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: AUTH0_CLIENT_ID,
      username: username,
      password: password,
      device: Constants.deviceId,
      connection: 'Username-Password-Authentication',
      scope: AUTH0_SCOPE,
    }),
  });

  let result = await response.json();
  return result;
}

async function signUpAsync(data) {
  let response = await fetch(SignUpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userData: {
        client_id: AUTH0_CLIENT_ID,
        connection: 'Username-Password-Authentication',
        email: data.email,
        password: data.password,
        username: data.username,
        user_metadata: {
          onboarded: true,
          given_name: data.firstName,
          family_name: data.lastName,
        },
      },
    }),
  });

  let result = await response.json();
  return result;
}

async function fetchUserProfileAsync(token) {
  let response = await fetch(`${AUTH0_DOMAIN}userinfo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  let result = await response.json();
  return result;
}

function tokenIsExpired(idToken) {
  const { exp } = jwtDecode(idToken, { complete: true });

  return exp - new Date().getTime() / 1000 <= 60 * 60;
}

async function refreshIdTokenAsync(refreshToken) {
  let response = await fetch(`${AUTH0_DOMAIN}delegation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      api_type: 'app',
      scope: AUTH0_SCOPE,
      client_id: AUTH0_CLIENT_ID,
      target: AUTH0_CLIENT_ID,
    }),
  });

  let result = await response.json();
  return result;
}

export default {
  signInAsync,
  signUpAsync,
  fetchUserProfileAsync,
  refreshIdTokenAsync,
  tokenIsExpired,
};
