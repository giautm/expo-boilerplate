import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

export default class AllContactsScreen extends React.Component {
  _handlePress = () => {
    this.props.navigation.navigate('SignIn');
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this._handlePress}>
        <Text>Hello, Navigation!</Text>
      </TouchableOpacity>
    );
  }
}
