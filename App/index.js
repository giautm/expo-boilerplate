'use strict';

import Expo from 'expo';
import React from 'react';
import {
  AppRegistry,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import { ApolloProvider } from 'react-apollo';

// This has to be first.
import AppStore from 'AppStore';

import ApolloClient from '../Api/ApolloClient';
import ExpoApp from 'ExpoApp';

class WrapWithStore extends React.Component {
  render() {
    return (
      <ApolloProvider client={ApolloClient} store={AppStore}>
        {this.props.children}
      </ApolloProvider>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <WrapWithStore>
        <ExpoApp {...this.props} />
      </WrapWithStore>
    );
  }
}
