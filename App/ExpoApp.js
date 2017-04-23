/**
 * @providesModule ExpoApp
 * @flow
 */

import React from 'react';
import {
  ActivityIndicator,
  View,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  Constants,
  Amplitude,
  Asset,
  Font,
} from 'expo';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import AppNavigator from './navigation';
import LocalStorage from '../Storage/LocalStorage';
import AuthTokenActions from '../Flux/AuthTokenActions';

function cacheImages(images) {
  return images.map((image) => Asset.fromModule(image).downloadAsync());
}

function getCurrentRouteName(navigationState) {
  if (navigationState) {
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return getCurrentRouteName(route);
    }
    return route.routeName;
  }

  return null;
}

@connect((data) => ExpoApp.getDataProps(data))
class ExpoApp extends React.Component {
  static getDataProps = (data) => ({
    nav: data.nav,
  });

  state = {
    isReady: false,
  };

  componentDidMount() {
    this._initializeStateAsync();
  }

  _initializeStateAsync = async () => {
    try {
      let storedAuthTokens = await LocalStorage.getAuthTokensAsync();
      if (storedAuthTokens) {
        this.props.dispatch(AuthTokenActions.setAuthTokens(storedAuthTokens));
      }

      if (Platform.OS === 'ios') {
        // let imageAssets = [
        //   require('../Assets/ios-menu-refresh.png'),
        //   require('../Assets/ios-menu-home.png'),
        // ];
        //
        // await Promise.all([
        //   ...cacheImages(imageAssets),
        //   Font.loadAsync(Ionicons.font),
        // ]);
      } else {
        await Promise.all([
          Font.loadAsync(Ionicons.font),
          Font.loadAsync(MaterialIcons.font),
        ]);
      }
    } catch (e) {
      // ..
    } finally {
      this.setState({ isReady: true });
    }
  };

  _handleNavigationStateChange = (prevState, currentState) => {
    const currentScreen = getCurrentRouteName(currentState);
    const prevScreen = getCurrentRouteName(prevState);

    if (prevScreen !== currentScreen) {
      Amplitude.logEventWithProperties('Navigation', { currentScreen });
    }
  };

  render() {
    if (!this.state.isReady) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <ActionSheetProvider>
          <AppNavigator
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.nav,
            })}
            onNavigationStateChange={this._handleNavigationStateChange}
          />
        </ActionSheetProvider>
      </View>
    );
  }
}

export default ExpoApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: Constants.statusBarHeight,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
