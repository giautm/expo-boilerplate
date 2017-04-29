'use strict';

import React from 'react';
import {
  AppRegistry,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import { Amplitude } from 'expo';
import { ApolloProvider } from 'react-apollo';
import ExpoSentryClient from '@expo/sentry-utils';

const packageJSON = require('../package.json');

Amplitude.initialize('2e7f793dba538810b7a6be28775a3afd');
ExpoSentryClient.setupSentry(
  `https://5911505268f442d4848d9a7893daf3b9@sentry.io/160874`,
  packageJSON.version,
  packageJSON.main,
);

// This has to be first.
import AppStore from '../Flux/Store';
import ApolloClient from '../Api/ApolloClient';
import ExpoApp from 'ExpoApp';

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={ApolloClient} store={AppStore}>
        <ExpoApp {...this.props} />
      </ApolloProvider>
    );
  }
}
