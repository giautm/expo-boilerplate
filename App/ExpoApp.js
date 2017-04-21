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
import { Asset, Font } from 'expo';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import AuthTokenActions from '../Flux/AuthTokenActions';
import LocalStorage from '../Storage/LocalStorage';
import AppNavigator from './navigation';

function cacheImages(images) {
  return images.map((image) => Asset.fromModule(image).downloadAsync());
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
        <ActionSheetProvider>
          <AppNavigator
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.nav,
            })}
          />
        </ActionSheetProvider>

        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
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
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
