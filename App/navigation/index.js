import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';

const AppNavigation = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      title: 'Sign in',
      headerTintColor: '#fff',
    },
  },
}, {
  cardStyle: {
    backgroundColor: '#fff',
  },
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#1ba8ff',
    },
  },
  mode: 'modal',
});


export default AppNavigation;
