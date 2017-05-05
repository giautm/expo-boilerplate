/* @flow */

import { print } from 'graphql/language/printer';
import { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import ConnectivityAwareHTTPNetworkInterface
  from './ConnectivityAwareHTTPNetworkInterface';

type AuthAwareNetworkInterfaceOptions = {
  getIdToken: () => string,
  setIdToken: (idToken: string) => void,
  getRefreshToken: () => string,
  idTokenIsValid: () => boolean,
  refreshIdTokenAsync: () => string,
};

class AuthAwareNetworkInterface {
  _requestQueue = [];

  _wsClient: SubscriptionClient;

  constructor(uri: string, wsClient: SubscriptionClient, options: AuthAwareNetworkInterfaceOptions = {}) {
    this._networkInterface = new ConnectivityAwareHTTPNetworkInterface(
      uri,
      options
    );
    this._wsClient = wsClient;

    this._getIdToken = options.getIdToken;
    this._setIdToken = options.setIdToken;
    this._getRefreshToken = options.getRefreshToken;
    this._idTokenIsValid = options.idTokenIsValid;
    this._refreshIdTokenAsync = options.refreshIdTokenAsync;

    this._applyAuthorizationHeaderMiddleware();
  }

  _applyAuthorizationHeaderMiddleware = () => {
    this._networkInterface.use([
      {
        applyMiddleware: (req, next) => {
          if (!req.options.headers) {
            req.options.headers = {};
          }

          const idToken = this._getIdToken();
          if (idToken) {
            req.options.headers['Authorization'] = `Bearer ${idToken}`;
          }

          next();
        },
      },
    ]);

    // TODO: Remove following lines after
    // subscriptions-transport-ws support middleware
    if (this._wsClient.use === undefined) {
      return;
    }

    this._wsClient.use([
      {
        applyMiddleware: (opts, next) => {
          const authToken = this._getIdToken();
          if (this._idTokenIsValid() || !authToken) {
            opts.connectionParams = {
              authToken,
            };
            next();
          } else {
            this._refreshIdTokenAsync().then((newIdToken) => {
              this._setIdToken(newIdToken);
              opts.connectionParams = {
                authToken: newIdToken,
              };
              next();
            }).catch(next);
          }
        },
      },
    ]);
  };

  query(request: any) {
    if (this._idTokenIsValid() || !this._getIdToken()) {
      return this._networkInterface.query(request);
    } else {
      // Throw it into the queue
      return new Promise(async (resolve, reject) => {
        this._requestQueue.push(() => {
          this._networkInterface.query(request).then(resolve).catch(reject);
        });

        // If it's the first one thrown into the queue, refresh token
        if (this._requestQueue.length === 1) {
          let newIdToken = await this._refreshIdTokenAsync();
          this._setIdToken(newIdToken);
          this._flushRequestQueue();
        }
      });
    }
  }

  subscribe(request: any, handler: any): number {
    return this._wsClient.subscribe({
      query: print(request.query),
      variables: request.variables,
    }, handler);
  }

  unsubscribe(id: number): void {
    this._wsClient.unsubscribe(id);
  }

  _flushRequestQueue() {
    this._requestQueue.forEach(queuedRequest => queuedRequest());
    this._requestQueue = [];
  }

  use(middleware) {
    return this._networkInterface.use(middleware);
  }

  useAfter(afterware) {
    return this._networkInterface.useAfter(afterware);
  }
}

export default function createAuthAwareNetworkInterface(options = {}) {
  let { uri, wsClient, ...otherOptions } = options;

  return new AuthAwareNetworkInterface(uri, wsClient, otherOptions);
}
