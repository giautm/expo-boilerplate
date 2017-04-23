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
    },
  },
}, {
  cardStyle: {
    backgroundColor: '#fff',
  },
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
    },
  },
  mode: 'modal',
});


export default AppNavigation;
